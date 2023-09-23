import { useUser } from "~/hooks/useUser";
import { api } from "~/utils/api";
import Image from "next/image";
import { HiArrowCircleUp } from "react-icons/hi";
import { Fragment, useEffect, useMemo, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { Dino } from "@prisma/client";

type DinoSlideProps = {
  handlePlace: (imageURL: string, motion: string, mint: string) => void;
  handleDragStart: (
    e: React.DragEvent<HTMLImageElement>,
    imageURL: string,
    motion: string,
    mint: string
  ) => void;
  handleFillCells: (dinos: any, showPFP: boolean) => void;
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
}: DinoSlideProps) {
  const { user, session } = useUser();
  const [showPFP, setShowPFP] = useState(false);

  const wallets = user?.wallets.map((wallet: any) => wallet.address) ?? [];

  const { data: holders, isLoading } = api.fusion.getUserDinos.useQuery({
    wallets: wallets,
  });

  console.log(holders);

  const holdersWithDefaults = holders && [...holders, { mints: [CLAYNO_LOGO] }];

  const togglePFP = (newToggleState: boolean) => {
    setShowPFP(newToggleState);
  };

  const extractedMints: any = holders
    ?.flatMap((holder) => holder.mints)
    .filter((dino) => dino.attributes !== null);

  return (
    <div className="fixed bottom-0 left-0 h-48 w-full overflow-y-scroll border-t border-stone-400 bg-stone-600">
      <div className="flex p-4">
        {user && session ? (
          <div>
            <div>
              <ToggleSwitch
                className="justify-self-start"
                toggleState={showPFP}
                label={"PFP Mode"}
                onToggle={togglePFP}
              />
              <button
                className="rounded-lg bg-fuchsia-500 px-2 py-1"
                onClick={() => handleFillCells(extractedMints, showPFP)}
              >
                Fill Cells
              </button>
            </div>
            <div className="flex flex-row flex-wrap gap-2">
              {holdersWithDefaults?.map((holder, index) => (
                <Fragment key={index}>
                  {holder.mints.map((dino) => (
                    <div
                      key={dino.mint}
                      className="relative flex h-36 w-36 cursor-grab justify-center overflow-clip rounded-md"
                    >
                      <Image
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
                      />
                      <div
                        onClick={() =>
                          handlePlace(
                            showPFP ? dino.pfp : dino.gif,
                            showPFP ? "PFP" : dino.attributes?.motion || "PFP",
                            dino.mint
                          )
                        }
                        className="flex transform cursor-pointer items-center justify-center opacity-0 transition-opacity hover:opacity-100"
                      >
                        <HiArrowCircleUp size={50} />
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div>Log in</div>
        )}
      </div>
    </div>
  );
}
