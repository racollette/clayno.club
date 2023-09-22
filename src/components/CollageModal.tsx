import React, { useEffect, useRef, useState } from "react";
import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import { CollagePreview } from "./CollagePreview";

type GridItemProps = {
  index: number;
  imageURL: string;
  motion: string;
  mint: string;
};

interface ModalProps {
  title: string;
  content: string;
}

const CollageModal: React.FC<ModalProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  const { data: collages, isLoading } = api.fusion.getUserCollages.useQuery({
    userId: user?.id || "None",
  });

  console.log(collages);

  console.log(isOpen);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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

  return (
    <div>
      <button
        onClick={handleButtonClick}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

          <div
            className="modal-container z-50 mx-auto w-1/2 overflow-y-auto rounded-lg bg-stone-800 shadow-lg"
            ref={modalRef}
          >
            <div className="modal-content px-6 py-4 text-left">
              <span
                className="modal-close z-50 cursor-pointer"
                onClick={closeModal}
              >
                &times;
              </span>
              <h2 className="mb-4 text-xl font-bold">{title}</h2>
              <div>
                {collages?.map((collage) => (
                  <CollagePreview
                    key={collage.id}
                    rows={collage.rows}
                    cols={collage.columns}
                    borderColor={collage.borderColor}
                    borderWidth={collage.borderWidth}
                    grid={collage.data as GridItemProps[][]}
                  />
                ))}
              </div>
              <p className="mb-4">{content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollageModal;
