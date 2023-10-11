import { AudioFile, Collage } from "@prisma/client";
import Image from "next/image";
import { Fragment, useRef, useEffect, useState } from "react";
import {
  HiTrash,
  HiPencilAlt,
  HiVideoCamera,
  HiDownload,
  HiFilm,
  HiEye,
  HiEyeOff,
  HiMusicNote,
  HiVolumeOff,
} from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/@/components/ui/select";
import useFusion from "~/hooks/useFusion";

type GridItemProps = {
  index: number;
  imageURL: string;
  motion: string;
  mint: string;
};

type CollageGridProps = {
  id: string;
  rows: number;
  cols: number;
  borderColor: string;
  borderWidth: number;
  grid: GridItemProps[][];
  clips: AudioFile[] | undefined;
  onDelete?: (event: React.MouseEvent<SVGElement>, id: string) => void;
  onLoad?: (collage: any) => void;
  onRecord?: (id: string) => void;
  onHide?: (id: string, hidden: boolean) => void;
  collage: Collage;
  asProfile?: boolean;
  isOwner?: boolean;
  selectRef: React.MutableRefObject<HTMLDivElement | null>;
};

export const CollagePreview = (props: CollageGridProps) => {
  const {
    rows,
    cols,
    borderColor,
    borderWidth,
    grid,
    clips,
    id,
    onDelete,
    onLoad,
    onRecord,
    onHide,
    collage,
    asProfile,
    isOwner,
    selectRef,
  } = props;
  const collageRef = useRef<HTMLDivElement>(null);

  const { jobStatus } = useFusion();
  const [videoURL, setVideoURL] = useState<string | null>(collage.url);
  const [monitorJob, setMonitorJob] = useState<boolean>(false);
  const [jobProgress, setJobProgress] = useState({
    state: null,
    position: null,
  });
  const [hidden, setHidden] = useState<boolean>(collage.hidden === true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  // const { status, url: storageURL } = collage;

  const checkProgress = async () => {
    try {
      const jobResponse = await jobStatus(id);

      if (jobResponse && jobResponse.status === 200) {
        const newJobProgress = {
          state: jobResponse.data.state,
          position: jobResponse.data.queuePosition,
        };
        setJobProgress(newJobProgress);
        if (newJobProgress.state === "completed") {
          setVideoURL(`https://api.dinoherd.cc/videos/${id}.mp4`);
          setMonitorJob(false);
        }
      }
    } catch (error) {
      // console.error("Error checking job status:", error);
    }
  };

  useEffect(() => {
    if (!monitorJob) return;
    checkProgress();
    const refreshInterval = setInterval(checkProgress, 5000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, [monitorJob]);

  useEffect(() => {
    checkProgress();
    const refreshInterval = setInterval(checkProgress, 5000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const handlePreviewClick = (url: string) => {
    window.open(url, "_blank");
  };

  const downloadVideo = (videoURL: string) => {
    fetch(videoURL)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create an invisible anchor element
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        // Specify the filename for the downloaded file
        a.download = `${id}.mp4`;

        // Append the anchor to the body and trigger the click event
        document.body.appendChild(a);
        a.click();

        // Remove the anchor element
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => console.error("Error downloading video:", error));
  };

  return (
    <div
      className={`flex flex-col ${
        asProfile && `items-center`
      } items-start lg:pr-4`}
      ref={collageRef}
    >
      <div
        className={`relative grid w-full ${
          asProfile && `w-full md:w-1/2 lg:w-2/5`
        }`}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {grid.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {row.map((item, colIndex) => {
              return (
                <div
                  key={`${rowIndex}_${colIndex}`}
                  style={{
                    outlineWidth: `${borderWidth / 2}px`,
                    outlineColor: borderColor,
                  }}
                  className={`relative box-border flex aspect-square items-center justify-center bg-neutral-800 outline ${
                    !asProfile && `lg:w-24`
                  }`}
                >
                  {item.imageURL && (
                    <>
                      <Image
                        key={`${rowIndex}_${colIndex}`}
                        src={
                          item.mint === "clayno_logo_vertical_1024x1024"
                            ? `${item.imageURL}`
                            : `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${item.imageURL}`
                        }
                        alt={`Dropped Image ${rowIndex}_${colIndex}`}
                        fill
                        className="object-cover"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
        {!asProfile ? (
          <div
            className={`absolute left-1/2 top-1/2 flex ${
              rows === 1
                ? `flex-row`
                : cols <= 2
                ? `grid grid-cols-2 items-center gap-0`
                : `flex-row`
            } h-full w-full -translate-x-1/2 -translate-y-1/2 transform  items-center justify-center ${
              cols <= 3 ? `gap-4` : `gap-10`
            } opacity-0 transition-opacity hover:opacity-100`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HiPencilAlt
                    className="inline-block cursor-pointer rounded-full bg-yellow-400/75 p-2"
                    color="black"
                    size={46}
                    onClick={(e) =>
                      onLoad &&
                      onLoad({
                        rows,
                        cols,
                        borderColor,
                        borderWidth,
                        grid,
                      })
                    }
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-semibold">Load</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  {!audioEnabled ? (
                    <HiMusicNote
                      className="inline-block cursor-pointer rounded-full bg-teal-500/75 p-2"
                      color="black"
                      size={46}
                      onClick={(e) => {
                        setAudioEnabled(true);
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <HiVolumeOff
                      className="inline-block cursor-pointer rounded-full bg-teal-500/75 p-2"
                      color="black"
                      size={46}
                      onClick={(e) => {
                        setAudioEnabled(false);
                        e.stopPropagation();
                      }}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-semibold">Add Audio</p>
                </TooltipContent>
              </Tooltip>

              {!videoURL && (
                <Tooltip>
                  <TooltipTrigger>
                    <HiVideoCamera
                      className="inline-block cursor-pointer rounded-full bg-amber-700/75 p-2"
                      color="black"
                      size={46}
                      onClick={(e) => {
                        onRecord && onRecord(id);
                        setMonitorJob(true);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-semibold">Generate Video</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger>
                  <HiTrash
                    className="inline-block cursor-pointer rounded-full bg-red-700/75 p-2"
                    color="black"
                    size={46}
                    onClick={(e) => onDelete && onDelete(e, id)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-semibold">Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <>
            {isOwner && (
              <div
                className={`absolute left-1/2 top-1/2 flex ${
                  rows === 1 ? `flex-row` : cols <= 2 ? `flex-col` : `flex-row`
                } h-full w-full -translate-x-1/2 -translate-y-1/2 transform  items-center justify-center ${
                  cols <= 3 ? `gap-4` : `gap-12`
                } opacity-0 transition-opacity hover:opacity-100`}
              >
                <TooltipProvider>
                  {!hidden ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <HiEyeOff
                          className="cursor-pointer rounded-full bg-yellow-400/75 p-2"
                          color="black"
                          size={50}
                          onClick={(e) => {
                            if (onHide) {
                              onHide(collage.id, true);
                              setHidden(true);
                            }
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs font-semibold">
                          Hide from Public
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <HiEye
                          className="cursor-pointer rounded-full bg-yellow-400/75 p-2"
                          color="black"
                          size={50}
                          onClick={(e) => {
                            if (onHide) {
                              onHide(collage.id, false);
                              setHidden(false);
                            }
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs font-semibold">Show to Public</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
            )}
          </>
        )}
      </div>

      {audioEnabled && (
        <div
          className="w-full py-2"
          ref={selectRef}
          onClick={(e) => e.preventDefault()}
        >
          <Select>
            <SelectTrigger className={`truncate text-xs`}>
              <SelectValue placeholder="None"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {clips?.map((clip) => (
                <SelectItem key={clip.id} value={clip.id}>
                  <div
                    className={`${
                      cols <= 2
                        ? `w-36`
                        : cols <= 3
                        ? `w-60`
                        : cols <= 4
                        ? `w-80`
                        : `w-96`
                    } truncate text-xs`}
                  >
                    {clip.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!asProfile && (
        <div className="self-center">
          {/* Display job progress */}
          {jobProgress.state !== null && (
            <div className="mt-3">
              {jobProgress.state === "active" && (
                <div className="flex flex-col justify-center gap-2">
                  <p className="text-center text-xs font-semibold">
                    Job Processing
                  </p>
                  <Image
                    src="/icons/Ellipsis-1.8s-200px.svg"
                    alt="Processing"
                    width={150}
                    height={50}
                  />
                </div>
              )}
              {jobProgress.state === "waiting" && (
                <div className="flex flex-row justify-between gap-2">
                  <Image
                    src="/icons/Blocks-5s-200px.svg"
                    alt="In Queue"
                    width={40}
                    height={40}
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-xs italic text-zinc-500">In Queue</p>
                    <p>
                      <span className="text-xs">
                        Position {jobProgress.position}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {videoURL && (
            <div className="flex flex-row justify-around gap-2 self-center">
              <p className="self-center font-semibold">Video ready!</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => handlePreviewClick(videoURL)}>
                    <HiFilm className="self-center" color="#00ff99" size={32} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-semibold">Preview</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger onClick={() => downloadVideo(videoURL)}>
                    <HiDownload
                      className="self-center"
                      color="#9999ff"
                      size={32}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-semibold">Download</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
