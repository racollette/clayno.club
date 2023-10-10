import React, { Fragment, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { AudioFile, Collage } from "@prisma/client";
import { HiMusicNote } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";
import FileUpload from "./FileUpload";
import AudioPlayer from "./AudioPlayer";

type MusicModalProps = {
  title: string;
  data: AudioFile[] | undefined;
  userId: string;
};

const MusicModal = ({ title, data, userId }: MusicModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[] | undefined>(
    undefined
  );

  useEffect(() => {
    setAudioFiles(data);
  }, []);

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

  // const deleteCollage = api.fusion.deleteCollage.useMutation();

  // const handleDeleteCollage = (
  //   event: React.MouseEvent<SVGElement>,
  //   id: string
  // ) => {
  //   try {
  //     event.stopPropagation();
  //     deleteCollage.mutate({ id: id });
  //     setCollages((prev) => prev?.filter((collage) => collage.id !== id));
  //   } catch (error) {
  //     console.error("Error deleting collage:", error);
  //   }
  // };

  console.log(audioFiles);

  return (
    <div className="lg:select-none">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={handleButtonClick}
            className={`rounded-lg bg-fuchsia-600 px-3 py-2 hover:bg-fuchsia-700`}
          >
            <HiMusicNote size={24} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

          <div
            className="modal-container z-50 mx-auto max-h-[85vh] w-11/12 overflow-y-auto rounded-lg bg-neutral-800 px-4 py-2 shadow-lg lg:w-3/4 lg:px-4 lg:py-2"
            ref={modalRef}
          >
            <div className="modal-content px-2 py-2 text-left lg:px-6 lg:py-4">
              <h2 className="mb-4 text-xl font-bold">{title}</h2>
              <div className="flex flex-col justify-start lg:gap-4">
                <FileUpload userId={userId} />
                {data?.map((clip) => (
                  <Fragment key={clip.id}>
                    {clip.url && (
                      <AudioPlayer audioUrl={clip.url} name={clip.name} />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicModal;