import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";
import ToggleSwitch from "../ToggleSwitch";
import { ScrollArea } from "~/@/components/ui/scroll-area";
import {
  HiChevronDown,
  HiChevronUp,
  HiViewGridAdd,
  HiArrowCircleUp,
} from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";
import LoginModal from "../profile/LoginModal";
import { useTimeSinceLastUpdate } from "~/hooks/useUpdated";

type DinoSlideProps = {
  handlePlace: (imageURL: string, motion: string, mint: string) => void;
  handleDragStart: (
    e: React.DragEvent<HTMLImageElement>,
    imageURL: string,
    motion: string,
    mint: string
  ) => void;
  handleFillCells: (dinos: any, showPFP: boolean) => void;
  selected: {
    imageURL: string;
    motion: string;
    mint: string;
  };
  setSelected: React.Dispatch<
    React.SetStateAction<{
      imageURL: string;
      motion: string;
      mint: string;
    }>
  >;
};

const CLAYNO_LOGO = {
  mint: "clayno_logo_vertical_1024x1024",
  species: "",
  skin: "",
  color: "",
  motion: "PFP",
  gif: "/images/clayno_logo_vertical_1024x1024.png",
  holderOwner: "Claynosaurz",
  name: "Claynosaurz",
  pfp: "/images/clayno_logo_vertical_1024x1024.png",
  rarity: 0,
  subDAOId: null,
};

export default function DinoSlide({
  handlePlace,
  handleDragStart,
  handleFillCells,
  selected,
  setSelected,
}: DinoSlideProps) {
  const { user, session } = useUser();
  const [showPFP, setShowPFP] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const wallets = user?.wallets.map((wallet: any) => wallet.address) ?? [];
  const lastUpdated = useTimeSinceLastUpdate("holders");

  const { data: holders, isLoading } = api.fusion.getUserDinos.useQuery({
    wallets: wallets,
  });

  const holdersWithDefaults = holders && [...holders, { mints: [CLAYNO_LOGO] }];

  const togglePFP = (newToggleState: boolean) => {
    setShowPFP(newToggleState);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const extractedMints: any = holders
    ?.flatMap((holder) => holder.mints)
    .filter((dino) => dino.attributes !== null);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full select-none px-2 transition-all`}
    >
      <div className="relative flex flex-row items-center justify-center">
        <div className="cursor-pointer px-8" onClick={() => toggleMinimize()}>
          {isMinimized ? (
            <HiChevronUp color="white" size={32} />
          ) : (
            <HiChevronDown color="white" size={32} />
          )}
        </div>
        {lastUpdated && (
          <div className="absolute right-0 top-0 mr-4 pt-2 text-right text-xs italic text-zinc-500">
            {`Updated ${lastUpdated}`}
          </div>
        )}
      </div>
      <ScrollArea
        className={`rounded-md border bg-black ${
          isMinimized ? "h-[60px]" : "h-[240px]"
        }`}
      >
        <div className="flex p-2 lg:p-4">
          {user && session ? (
            <div className="flex flex-grow flex-row justify-between">
              <div className="flex flex-row flex-wrap gap-2">
                {holdersWithDefaults?.map((holder, index) => (
                  <Fragment key={index}>
                    {holder.mints.map((dino: any) => (
                      <div
                        key={dino.mint}
                        className={` ${
                          selected.mint === dino.mint
                            ? `border-4 border-emerald-500`
                            : ``
                        } relative flex h-28 w-28 cursor-grab justify-center overflow-clip rounded-md lg:h-36 lg:w-36`}
                      >
                        <Image
                          className="transform-gpu transition-transform hover:scale-125"
                          src={
                            dino.mint !== "clayno_logo_vertical_1024x1024"
                              ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                                  showPFP ? dino.pfp : dino.gif
                                }`
                              : dino.pfp
                          }
                          alt=""
                          fill
                          quality={75}
                          onDragStart={(e) =>
                            handleDragStart(
                              e,
                              e.currentTarget.src,
                              dino.attributes?.motion || "",
                              dino.mint
                            )
                          }
                          onClick={(e) =>
                            setSelected({
                              mint: dino.mint,
                              motion: dino.attributes?.motion || "",
                              imageURL: e.currentTarget.src,
                            })
                          } // Set selected image
                        />

                        <HiArrowCircleUp
                          onClick={() =>
                            handlePlace(
                              showPFP ? dino.pfp : dino.gif,
                              showPFP
                                ? "PFP"
                                : dino.attributes?.motion || "PFP",
                              dino.mint
                            )
                          }
                          className="flex transform cursor-pointer place-self-center opacity-0 transition-opacity hover:opacity-100"
                          size={50}
                        />
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
              {/* chatgpt */}
              <div className="flex flex-col justify-start gap-3 px-1 lg:px-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <ToggleSwitch
                        checked={showPFP}
                        onChange={togglePFP}
                        label="PFP"
                        activeColor="bg-blue-500"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle PFPs</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      className="self-end rounded-lg bg-fuchsia-500 px-2 py-1 hover:bg-fuchsia-400"
                      onClick={() => handleFillCells(extractedMints, showPFP)}
                    >
                      <HiViewGridAdd size={24} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fill Cells</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ) : (
            <div className="flex flex-grow items-center justify-center">
              <LoginModal loginMessage="Sign in to see NFTs" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
