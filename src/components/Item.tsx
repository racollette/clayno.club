import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/ui/dialog";

type ItemProps = {
  id: string;
  item: any;
};

type ImageState = "gif" | "pfp" | "class";

export const Item = ({ id, item }: ItemProps) => {
  const [imageState, setImageState] = useState<ImageState>("gif");
  const [imageBlobs, setImageBlobs] = useState({
    pfp: null,
    gif: null,
    class: null,
  });

  const isDino = item.gif && item.pfp;
  const isClay = item.color;
  const isClaymaker = item.edition;

  const handleDownload = (name: string, extension: string) => {
    const blob = imageBlobs[imageState];

    if (blob) {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);
    }
  };

  useEffect(() => {
    const getImageBlob = async (imageType: string) => {
      try {
        const response = await fetch(
          `${imageType === "pfp" ? item.pfp : item.gif}`
        );

        if (response.ok) {
          const blob = await response.blob();
          setImageBlobs((prevBlobs) => ({ ...prevBlobs, [imageType]: blob }));
        } else {
          throw new Error("Image download failed");
        }
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    };

    getImageBlob("pfp");
    getImageBlob("gif");
  }, [item.pfp, item.gif]);

  return (
    <div
      key={item.mint}
      className={`relative flex h-28 w-28 cursor-grab justify-center overflow-clip rounded-md lg:h-40 lg:w-40`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Image
            className="transform-gpu transition-transform hover:scale-125"
            src={
              isDino
                ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                    imageState === "pfp" ? item.pfp : item.gif
                  }`
                : `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                    item.image || item.gif
                  }`
            }
            alt={"Clayno"}
            fill
            quality={75}
          />
        </DialogTrigger>
        <DialogContent className="flex max-w-2xl flex-col gap-6 border-none bg-neutral-900/80 p-4">
          <DialogHeader className="">
            <DialogTitle className="m-0 text-white">{item.name}</DialogTitle>
          </DialogHeader>
          {/* <DialogDescription className="text-neutral-500">
            Filter herds by traits
          </DialogDescription> */}
          <div className="grid grid-cols-8 items-start justify-start">
            <div className="relative col-span-5 flex aspect-square flex-wrap items-center justify-center gap-4 overflow-clip rounded-lg p-4 text-white">
              <Image
                src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                  imageState === "pfp" ? item.pfp : item.gif || item.image
                }`}
                alt={"Clayno"}
                fill
              />
              <div className="absolute bottom-2 flex w-[95%] flex-row justify-between rounded-md bg-black px-2 py-2">
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => {
                      setImageState("gif");
                    }}
                    className={`rounded-sm px-4 py-1 text-xs font-bold ${
                      imageState === "gif" ? `bg-emerald-600` : `bg-neutral-500`
                    }`}
                  >
                    {isClay
                      ? `IMAGE`
                      : isClaymaker
                      ? `GIF`
                      : isDino
                      ? `GIF`
                      : `IMAGE`}
                  </button>
                  {item.pfp && (
                    <button
                      onClick={() => {
                        setImageState("pfp");
                      }}
                      className={`rounded-sm  px-4 py-1 text-xs font-bold ${
                        imageState === "pfp"
                          ? `bg-emerald-600`
                          : `bg-neutral-500`
                      }`}
                    >
                      PFP
                    </button>
                  )}

                  {item.attributes?.class && (
                    <button
                      onClick={() => {
                        setImageState("class");
                      }}
                      className={`rounded-sm px-4 py-1 text-xs font-bold ${
                        imageState === "class"
                          ? `bg-emerald-600`
                          : `bg-neutral-500`
                      }`}
                    >
                      CLASS
                    </button>
                  )}
                </div>
                <div>
                  <button
                    className="rounded-sm bg-cyan-600 px-4 py-1 text-xs font-bold"
                    onClick={() =>
                      handleDownload(
                        item.name,
                        imageState === "pfp" ? "png" : "gif"
                      )
                    }
                  >
                    DOWNLOAD
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-3 font-clayno text-lg text-white">
              Traits
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
