import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export const EventAlert = () => {
  const [showModal, setShowModal] = useState(true);
  const modalContentRef = useRef(null);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleClickOutsideModal = (event: { target: any }) => {
      // Check if the click occurred outside of the modal content
      if (
        showModal &&
        modalContentRef.current // &&
        // !modalContentRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    };

    // Add event listener when the modal is shown
    if (showModal) {
      document.addEventListener("click", handleClickOutsideModal);
    }

    // Clean up event listener when the component is unmounted or the modal is hidden
    return () => {
      document.removeEventListener("click", handleClickOutsideModal);
    };
  }, [showModal]);

  return (
    <>
      {showModal && (
        <div className="fixed left-0 top-40 z-50 flex w-full items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalContentRef}
            className="m-2 flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-neutral-800 p-4 text-white md:w-1/2 md:p-8 lg:w-1/3 xl:w-1/4"
          >
            <div className="font-clayno text-xl font-bold">Event Alert</div>
            <div className="relative aspect-video w-full">
              <Image
                src="https://i.ibb.co/Q8MRJs0/Screenshot-from-2024-02-23-21-43-12.png"
                alt="Attention"
                fill
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1 text-center text-sm font-bold">
              <p>The Apres Winter Olympics are underway!</p>
              <Link
                href="https://olympics.clayno.club"
                className="text-sky-500"
              >
                Compete now!
              </Link>
            </div>
            <div className="mt-4 flex w-full flex-row items-end justify-end gap-4 text-sm font-bold">
              <Link
                href="https://olympics.clayno.club"
                target="_blank"
                className="rounded-lg bg-fuchsia-700 px-3 py-2 hover:cursor-pointer hover:bg-fuchsia-600"
              >
                To the slopes!
              </Link>
              <button
                className="rounded-lg bg-sky-600 px-3 py-2 hover:bg-sky-500"
                onClick={handleCloseModal}
              >
                No thanks, I hate fun.
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
