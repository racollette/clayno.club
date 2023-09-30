import React, { useEffect, useRef, useState } from "react";
import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import { CollagePreview } from "./CollagePreview";
import { Collage } from "@prisma/client";
import { HiCollection } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";
import * as ScrollArea from "@radix-ui/react-scroll-area";

type GridItemProps = {
  index: number;
  imageURL: string;
  motion: string;
  mint: string;
};

interface ModalProps {
  title: string;
  content: string;
  pulse: boolean;
  data: Collage[] | undefined;
  onLoad: (collage: any) => void;
  onRecord: (id: string) => void;
}

const CollageModal = ({ title, pulse, data, onLoad, onRecord }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [collages, setCollages] = useState<Collage[] | undefined>(undefined);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setCollages(data);
  }, [data]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      // Add a click event listener to the document
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      // Remove the event listener when the modal is unmounted or closed
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the click event from propagating to the document
    event.stopPropagation();
    openModal();
  };

  const deleteCollage = api.fusion.deleteCollage.useMutation();

  const handleDeleteCollage = (
    event: React.MouseEvent<SVGElement>,
    id: string
  ) => {
    try {
      event.stopPropagation();
      deleteCollage.mutate({ id: id });
      setCollages((prev) => prev?.filter((collage) => collage.id !== id));
    } catch (error) {
      console.error("Error deleting collage:", error);
    }
  };

  return (
    <div className="select-none">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={handleButtonClick}
            className={`${
              pulse ? `animate-pulse` : `animate-none`
            } rounded-lg bg-indigo-500 px-3 py-2 hover:bg-indigo-700`}
          >
            <HiCollection size={24} />
          </TooltipTrigger>
          <TooltipContent>
            <p>My Collages</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

          <div
            className="modal-container z-50 mx-auto w-3/4 overflow-y-auto rounded-lg bg-stone-800 px-4 py-2 shadow-lg"
            ref={modalRef}
          >
            <div className="modal-content px-6 py-4 text-left">
              {/* <span
                className="modal-close z-50 cursor-pointer"
                onClick={closeModal}
              >
                &times;
              </span> */}
              <h2 className="mb-4 text-xl font-bold">{title}</h2>
              <div className="flex flex-row gap-4">
                {collages && collages.length > 0 ? (
                  <>
                    {collages?.map((collage) => (
                      <CollagePreview
                        key={collage.id}
                        id={collage.id}
                        rows={collage.rows}
                        cols={collage.columns}
                        borderColor={collage.borderColor}
                        borderWidth={collage.borderWidth}
                        grid={collage.data as GridItemProps[][]}
                        onDelete={(event) =>
                          handleDeleteCollage(event, collage.id)
                        }
                        onLoad={onLoad}
                        onRecord={onRecord}
                        collage={collage}
                      />
                    ))}
                  </>
                ) : (
                  <div className="flex h-40 items-center text-center text-xl font-semibold text-red-400">
                    No Collages yet!
                  </div>
                )}
              </div>
              {/* <p className="mb-4">{content}</p> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollageModal;
