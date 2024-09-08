import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogClose,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/ui/dialog";
import Link from "next/link";
import { HiX } from "react-icons/hi";

type ItemProps = {
  item: any;
  type: string;
  displayMode?: ImageState;
};

type ImageState = "gif" | "pfp" | "class";

const Item = ({ item, type, displayMode }: ItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageState, setImageState] = useState<ImageState>(
    displayMode ?? "gif"
  );
  const router = useRouter();

  useEffect(() => {
    // Open the modal if the URL has a specific query parameter
    if (router.query.modal === item.mint) {
      setIsOpen(true);
    }
  }, [router.query, item.mint]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Add a query parameter when opening the modal
      router.push(`${router.pathname}?modal=${item.mint}`, undefined, { shallow: true });
    } else {
      // Remove the query parameter when closing the modal
      router.push(router.pathname, undefined, { shallow: true });
    }
  };

  // console.log(imageState);
  const [imageBlobs, setImageBlobs] = useState({
    pfp: null,
    gif: null,
    class: null,
  });

  const isDino = type === "dino";
  const isClay = type === "clay";
  const isClaymaker = type === "claymaker";
  const isConsumable = type === "consumable";
  const isPizza = item.symbol === "PIZZA";

  const attributesArray = Object.entries(item.attributes ?? {});

  const handleDownload = async (name: string, extension: string) => {
    let blob = imageBlobs[imageState];

    if (!blob) {
      // @ts-expect-error: just a quick fix
      blob = await getImageBlob(imageState);
    }

    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const imageName =
        imageState === "class"
          ? `${item.name}_${item.attributes.class}`
          : item.name;
      link.setAttribute("download", `${imageName}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);
    }
  };

  const getImageBlob = async (imageType: string) => {
    try {
      const response = await fetch(
        `${
          imageType === "pfp"
            ? item.pfp
            : imageType === "class"
            ? item.classPFP
            : isDino || isClaymaker || isClay
            ? item.gif
            : item.image
        }`
      );

      if (response.ok) {
        const blob = await response.blob();
        setImageBlobs((prevBlobs) => ({ ...prevBlobs, [imageType]: blob }));
        return blob;
      } else {
        throw new Error("Image download failed");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  // useEffect(() => {
  // getImageBlob("pfp");
  // getImageBlob("gif");
  // getImageBlob("class");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div
      key={item.mint}
      className={`relative flex h-24 w-24 cursor-pointer justify-center overflow-clip rounded-md lg:h-40 lg:w-40`}
    >
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Image
            className="transform-gpu transition-transform hover:scale-125"
            src={
              isDino
                ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                    imageState === "pfp"
                      ? item.pfp
                      : imageState === "class"
                      ? item.classPFP || item.pfp
                      : item.gif
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
        <DialogContent className="flex w-11/12 max-w-2xl flex-col rounded-lg border-none bg-neutral-900/80 gap-0 p-0 overflow-hidden max-h-[90vh]">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-neutral-900/80 px-4 py-2">
            <DialogTitle className="font-clayno text-lg text-white pr-8 truncate">
              {item.name}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <HiX className="h-6 w-6 text-white" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <div className="overflow-y-auto">
            <div className="flex flex-col items-start justify-start gap-4 px-4 pb-4 md:grid md:grid-cols-8 md:gap-0">
              <div className="relative flex aspect-square w-full flex-wrap items-center justify-center overflow-hidden rounded-lg md:col-span-5">
                <Image
                  src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                    imageState === "pfp"
                      ? item.pfp
                      : imageState === "class"
                      ? item.classPFP || item.pfp
                      : item.gif || item.image
                  }`}
                  alt={"Clayno"}
                  fill
                />
                <div className="absolute bottom-2 left-2 right-2 flex flex-row justify-between rounded-md bg-black/80 text-white px-2 py-2">
                  <div className="flex flex-row gap-1">
                    <button
                      onClick={() => setImageState("gif")}
                      className={`rounded-sm px-1.5 py-0.5 font-clayno text-[10px] font-bold ${
                        imageState === "gif" ? `bg-emerald-600` : `bg-neutral-500`
                      }`}
                    >
                      {isClay ? `IMAGE` : isClaymaker ? `GIF` : isDino ? `GIF` : `IMAGE`}
                    </button>
                    {item.pfp && (
                      <button
                        onClick={() => setImageState("pfp")}
                        className={`rounded-sm px-1.5 py-0.5 font-clayno text-[10px] font-bold ${
                          imageState === "pfp" ? `bg-emerald-600` : `bg-neutral-500`
                        }`}
                      >
                        PFP
                      </button>
                    )}
                    {item.classPFP && (
                      <button
                        onClick={() => setImageState("class")}
                        className={`rounded-sm px-1.5 py-0.5 font-clayno text-[10px] font-bold ${
                          imageState === "class" ? `bg-emerald-600` : `bg-neutral-500`
                        }`}
                      >
                        CLASS
                      </button>
                    )}
                  </div>
                  <button
                    className="rounded-sm bg-cyan-600 px-1.5 py-0.5 font-clayno text-[10px] font-bold"
                    onClick={() => handleDownload(item.name, imageState === "pfp" || imageState === "class" ? "png" : isDino ? "gif" : isClaymaker ? "gif" : isPizza ? "gif" : "png")}
                  >
                    DOWNLOAD
                  </button>
                </div>
              </div>
              <div className="h-full w-full items-center gap-4 px-4 font-clayno text-lg text-white md:col-span-3">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex flex-col">
                    <h1 className="pb-2">TRAITS</h1>
                    {isDino && (
                      <>
                        {attributesArray.map(([key, value]) => {
                          if (key === "mint") return null;
                          return (
                            <div
                              key={key}
                              className="flex flex-row justify-between"
                            >
                              <p className="text-sm text-neutral-500">{key}</p>
                              <p className="text-sm">{value as string}</p>
                            </div>
                          );
                        })}
                      </>
                    )}

                    {isClaymaker && (
                      <div className="flex flex-row justify-between">
                        <p className="text-sm text-neutral-500">Edition</p>
                        <p className="text-sm">{item.edition}</p>
                      </div>
                    )}

                    {isClay && (
                      <div className="flex flex-row justify-between">
                        <p className="text-sm text-neutral-500">Color</p>
                        <p className="text-sm">{item.color}</p>
                      </div>
                    )}

                    {isConsumable && (
                      <>
                        {item.attributes &&
                          item.attributes.map(
                            (
                              trait: { value: string; trait_type: string },
                              idx: number
                            ) => {
                              return (
                                <div
                                  key={idx}
                                  className="flex flex-row justify-between"
                                >
                                  {trait.value.length > 0 && (
                                    <p className="text-sm text-neutral-500">
                                      {trait.trait_type}
                                    </p>
                                  )}
                                  <p className="text-sm">{trait.value}</p>
                                </div>
                              );
                            }
                          )}
                      </>
                    )}
                  </div>
                  <div className="flex flex-row gap-2 place-self-end">
                    <Link
                      href={`https://tensor.trade/item/${item.mint}`}
                      target="_blank"
                    >
                      <Image
                        src="/icons/tensor.svg"
                        alt="Tensor"
                        width={24}
                        height={24}
                        className="hover:scale-125"
                      />
                    </Link>
                    <Link
                      href={`https://magiceden.io/item-details/${item.mint}`}
                      target="_blank"
                    >
                      <Image
                        src="/icons/magic_eden.svg"
                        alt="Magic Eden"
                        width={24}
                        height={24}
                        className="hover:scale-125"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Item;
