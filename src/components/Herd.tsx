import type {
  Attributes,
  Dino,
  Discord,
  Herd,
  Telegram,
  Twitter,
  Wallet,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { truncateAccount } from "~/utils/addresses";
import {
  getRarityColor,
  getTraitBadgeColor,
  getBorderColor,
} from "~/utils/colors";
import { handleUserPFPDoesNotExist } from "~/utils/images";
import { extractProfileFromUser } from "~/utils/wallet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/ui/dialog";
import { Button } from "~/@/components/ui/button";
import { api } from "~/utils/api";
import DinoSelector from "./DinoSelector";

type HerdProps = {
  herd: Herd & {
    dinos: (Dino & {
      attributes: Attributes | null;
    })[];
  };
  showDactyl: boolean;
  showSaga: boolean;
  showOwner: boolean;
  showPFP: boolean;
  owner?:
    | {
        discord: Discord | null;
        twitter: Twitter | null;
        telegram: Telegram | null;
        id: string;
        defaultAddress: string;
        wallets: Wallet[];
      }
    | undefined;
  currentUser?: {
    id: string;
    wallets: Wallet[];
  } | null;
};

// First, let's add a helper function to get the border style based on tier
const getHerdBorderStyle = (tier: number) => {
  switch (tier) {
    case 1: // Basic
      return "border-2 border-neutral-400";
    case 2: // Impressive
      return "border-2 bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-500 animate-gradient";
    case 3: // Flawless
      return "border-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient";
    case 4: // Perfect
      return "border-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient-fast";
    default:
      return "border-2 border-neutral-700";
  }
};

export default function Herd(props: HerdProps) {
  const { herd, showDactyl, showSaga, showOwner, showPFP, owner, currentUser } =
    props;
  const [filteredHerd, setFilteredHerd] = useState(herd);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDinos, setSelectedDinos] = useState<string[]>(
    herd.dinos.map((d) => d.mint)
  );

  // Instead of a single hover state, we need one for each dino
  const [hoveredDinos, setHoveredDinos] = useState<Record<string, boolean>>({});

  const utils = api.useUtils();
  const updateHerdMutation = api.herd.updateHerd.useMutation({
    onSuccess: () => {
      utils.herd.getAllHerds.invalidate();
      utils.herd.getUserHerds.invalidate();
      setIsDialogOpen(false);
    },
  });

  const { username, userHandle, userPFP, favoriteDomain } =
    extractProfileFromUser(owner);

  const isHerdOwner = currentUser?.wallets.some(
    (wallet) => wallet.address === herd.owner
  );

  useEffect(() => {
    let filteredHerd = herd.dinos;

    if (!showDactyl && !showSaga) {
      filteredHerd = filteredHerd.filter(
        (dino) =>
          dino.attributes?.species !== "Para" &&
          dino.attributes?.species !== "Spino" &&
          dino.attributes?.species !== "Dactyl"
      );
    } else if (!showDactyl) {
      filteredHerd = filteredHerd.filter(
        (dino) => dino.attributes?.species !== "Dactyl"
      );
    } else if (!showSaga) {
      filteredHerd = filteredHerd.filter(
        (dino) =>
          dino.attributes?.species !== "Para" &&
          dino.attributes?.species !== "Spino"
      );
    }

    setFilteredHerd({ ...herd, dinos: filteredHerd });
  }, [showDactyl, showSaga, herd]);

  const handleSaveEdit = () => {
    updateHerdMutation.mutate({
      herdId: herd.id,
      dinoMints: selectedDinos,
    });
  };

  return (
    <div
      key={filteredHerd.id}
      className="relative mb-1 flex w-full flex-col rounded-lg p-[2px] transition-all duration-300"
    >
      {/* Add gradient background div */}
      <div
        className={`absolute inset-0 rounded-lg ${getHerdBorderStyle(
          filteredHerd.tier
        )}`}
      />

      {/* Add content container with background */}
      <div className="relative z-10 flex w-full flex-col rounded-lg bg-neutral-800 p-4 md:p-6">
        <div
          className={`mb-1 flex flex-none flex-wrap items-center justify-between rounded-md  ${getBorderColor(
            filteredHerd.matches
          )}`}
        >
          {filteredHerd.tier !== 4 && (
            <div className="flex flex-row gap-1">
              {filteredHerd.matches.split("_").map((trait, index) => (
                <div
                  className={`rounded-md px-2 py-1 text-xs font-extrabold text-white ${getTraitBadgeColor(
                    trait
                  )}`}
                  key={index}
                >
                  {trait}
                </div>
              ))}
            </div>
          )}

          {showOwner && (
            <>
              {owner?.twitter ||
              owner?.discord ||
              (owner?.telegram && owner?.telegram.isActive) ? (
                <div className="mx-3 flex flex-row justify-center align-middle">
                  <div className="mr-2 flex">
                    <Link
                      className="flex flex-row rounded-md px-2 py-2 text-white hover:bg-white/20"
                      href={`/inventory/${username}`}
                      target="_blank"
                    >
                      <Image
                        className="mr-2 self-center rounded-md"
                        src={userPFP ?? ""}
                        alt="Avatar"
                        width={24}
                        height={24}
                        onError={handleUserPFPDoesNotExist}
                      />
                      <div className="self-center text-white">{userHandle}</div>
                    </Link>
                  </div>

                  {/* {owner.twitter && !owner.twitter.private && (
                    <Link
                      className="self-center rounded-md px-2 py-2 text-white hover:bg-white/20"
                      href={`https://twitter.com/${owner.twitter.username}`}
                      target="_blank"
                    >
                      <Image
                        src="/icons/twitter.svg"
                        alt="Twitter"
                        width={20}
                        height={20}
                      />
                    </Link>
                  )} */}

                  {/* <Link
                    className="self-center rounded-md px-2 py-2 text-white hover:bg-white/20"
                    href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                    target="_blank"
                  >
                    <Image
                      src="/icons/tensor.svg"
                      alt="Tensor Profile"
                      height={20}
                      width={20}
                    />
                  </Link> */}
                </div>
              ) : (
                <div className="flex flex-row gap-2 align-middle">
                  <Link
                    className="flex flex-row gap-2 rounded-md px-2 py-2 text-white hover:bg-white/20"
                    href={`/inventory/${herd.owner}`}
                  >
                    <div className="relative aspect-square self-center">
                      <Image
                        src={`https://ui-avatars.com/api/?name=${herd.owner}&background=random`}
                        alt="Avatar"
                        height={24}
                        width={24}
                        className="rounded-md"
                      />
                    </div>
                    <div className={`text-md self-center font-bold text-white`}>
                      {favoriteDomain
                        ? `${favoriteDomain}.sol`
                        : truncateAccount(herd.owner)}
                    </div>
                  </Link>
                  {/* <Link
                    className="rounded-md px-2 py-2 text-white hover:bg-white/20"
                    href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
                    target="_blank"
                  >
                    <Image
                      src="/icons/tensor.svg"
                      alt="Tensor Profile"
                      height={20}
                      width={20}
                    />
                  </Link> */}
                </div>
              )}
            </>
          )}

          <div
            className={`rounded-md px-2 ${
              filteredHerd.tier === 4 && "ml-auto"
            } py-1 text-xs text-white  ${getRarityColor(herd.rarity)}`}
          >
            {herd.rarity}
          </div>
        </div>

        <div className={`grid grid-cols-3`} key={herd.id}>
          {filteredHerd.dinos.map((dino) => (
            <div key={dino.mint}>
              {dino.attributes && (
                <div
                  key={dino.mint}
                  className={`relative m-0.5 aspect-square overflow-clip rounded-md border-2${getBorderColor(
                    herd.matches
                  )}`}
                  onMouseEnter={() =>
                    setHoveredDinos((prev) => ({ ...prev, [dino.mint]: true }))
                  }
                  onMouseLeave={() =>
                    setHoveredDinos((prev) => ({ ...prev, [dino.mint]: false }))
                  }
                >
                  <Image
                    src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                      showPFP
                        ? dino.pfp
                        : hoveredDinos[dino.mint]
                        ? dino.pfp
                        : dino.gif
                    }`}
                    alt="Clayno gif"
                    quality={100}
                    fill
                    className="cursor-pointer"
                  />
                  {hoveredDinos[dino.mint] && (
                    <div className="absolute bottom-1 right-1 rounded-md bg-black px-2 py-1 text-xs text-white">
                      {dino.name.split(" ").pop()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {isHerdOwner && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-2 border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              >
                Edit Herd
              </Button>
            </DialogTrigger>
            <DialogContent className="gap-0 border-neutral-700 bg-neutral-900 p-4 font-clayno text-white">
              <DialogHeader>
                <DialogTitle>Edit Herd</DialogTitle>
              </DialogHeader>
              <div className="flex max-h-[80vh] flex-col gap-4 py-2">
                <DinoSelector
                  owner={herd.owner}
                  currentHerd={herd.dinos}
                  onSelectionChange={setSelectedDinos}
                  wallets={currentUser?.wallets ?? []}
                />
                <Button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800"
                  disabled={updateHerdMutation.isLoading}
                >
                  {updateHerdMutation.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
