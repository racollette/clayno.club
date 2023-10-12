import React, { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { CollagePreview } from "./CollagePreview";
import { AudioFile, Collage } from "@prisma/client";
import { HiCollection, HiXCircle } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";

export type GridItemProps = {
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
  clips: AudioFile[] | undefined;
  onLoad: (collage: any) => void;
  onRecord: (id: string) => void;
}

const CollageModal = ({
  title,
  pulse,
  data,
  clips,
  onLoad,
  onRecord,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLDivElement | null>(null);
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

  // useEffect(() => {
  //   const handleOutsideClick = (event: MouseEvent) => {
  //     const modalContains =
  //       modalRef.current && modalRef.current.contains(event.target as Node);

  //     if (!modalContains) {
  //       // The click happened outside of the modal, close the modal
  //       closeModal();
  //     }
  //   };

  //   if (isOpen) {
  //     // Add a click event listener to the document
  //     document.addEventListener("click", handleOutsideClick);
  //   }

  //   return () => {
  //     // Remove the event listener when the modal is unmounted or closed
  //     document.removeEventListener("click", handleOutsideClick);
  //   };
  // }, [isOpen]);

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
    <div className="lg:select-none">
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
          {/* Add backdrop overlay */}
          <div className="fixed inset-0 bg-neutral-900 opacity-90"></div>

          <div
            className="z-50 mx-auto max-h-[85vh] w-11/12 overflow-y-auto rounded-lg bg-neutral-800 px-4 py-2 shadow-lg lg:w-3/4 lg:px-4 lg:py-2"
            ref={modalRef}
          >
            <div className="px-2 py-2 text-left lg:px-6 lg:py-4">
              <div className="mb-4 flex  flex-row justify-between">
                <h2 className="mb-4 text-xl font-bold">{title}</h2>
                <HiXCircle
                  onClick={closeModal}
                  size={32}
                  className={`z-50 cursor-pointer hover:text-red-500`}
                />
              </div>
              <div className="flex flex-col justify-start gap-8 lg:flex-row lg:gap-4">
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
                        clips={clips}
                        onDelete={(event) =>
                          handleDeleteCollage(event, collage.id)
                        }
                        onLoad={onLoad}
                        onRecord={onRecord}
                        collage={collage}
                        selectRef={selectRef}
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
