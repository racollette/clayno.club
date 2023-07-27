import type { Attributes, Dino, Herd } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { truncateAccount } from "~/utils/addresses";
import { api } from "~/utils/api";

// const coreSpecies = ["Rex", "Bronto", "Ankylo", "Raptor", "Trice", "Stego"];

type HerdProps = {
  herd: Herd & {
    herd: (Dino & {
      attributes: Attributes | null;
    })[];
  };
  showDactyl: boolean;
  showSaga: boolean;
  showOwner: boolean;
  showPFP: boolean;
};

export default function Herd(props: HerdProps) {
  const { herd, showDactyl, showSaga, showOwner, showPFP } = props;
  const [filteredHerd, setFilteredHerd] = useState(herd);

  const { data: owner } = api.binding.getUser.useQuery({
    type: "wallet",
    id: herd.owner,
  });

  useEffect(() => {
    let filteredHerd = herd.herd;

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

    setFilteredHerd({ ...herd, herd: filteredHerd });
  }, [showDactyl, showSaga, herd]);

  // const discord: Discord = owner?.discord ? owner.discord : ""

  return (
    <div
      key={filteredHerd.id}
      className="mb-6 flex w-full flex-col rounded-lg bg-stone-800 p-4 md:p-6"
    >
      <div
        className={`mb-1 flex flex-none flex-wrap items-center justify-between rounded-md  ${getColor(
          filteredHerd.matches
        )}`}
      >
        {filteredHerd.tier !== 4 && (
          <div className="flex flex-row">
            {filteredHerd.matches.split("_").map((trait, index) => (
              <div
                className={`m-1 rounded-md px-2 py-1 text-xs font-extrabold text-white ${getTraitBadgeColor(
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
            {owner ? (
              <div className="mx-3 flex flex-row justify-center align-middle">
                {owner.discord && (
                  <div className="mr-2 flex">
                    <Link
                      className="flex flex-row rounded-md px-2 py-2 text-white hover:bg-white/20"
                      href={`/profile/${owner.discord.global_name}`}
                    >
                      <Image
                        className="mr-2 self-center rounded-md"
                        src={owner.discord.image_url}
                        alt="Avatar"
                        width={24}
                        height={24}
                      />
                      <div className="self-center text-white">
                        {owner.discord.global_name}
                      </div>
                    </Link>
                  </div>
                )}
                {owner.twitter && (
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
                )}
                <Link
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
                </Link>
              </div>
            ) : (
              <div className="flex flex-row gap-2 align-middle">
                <Link
                  className="flex flex-row gap-2 rounded-md px-2 py-2 text-white hover:bg-white/20"
                  href={`/profile/${herd.owner}`}
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
                    {truncateAccount(herd.owner)}
                  </div>
                </Link>
                <Link
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
                </Link>
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
        {filteredHerd.herd.map((dino) => (
          <div key={dino.mint}>
            {dino.attributes && (
              <div
                key={dino.mint}
                className={`relative m-0.5 aspect-square overflow-clip rounded-md border-2${getColor(
                  herd.matches
                )}`}
              >
                <Image
                  src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                    showPFP ? dino.pfp : dino.gif
                  }`}
                  alt="Clayno gif"
                  quality={100}
                  fill
                ></Image>
                {/* {dino.rarity && (
                  <div
                  className={`absolute bottom-0 left-0 m-1 rounded-lg  px-2 py-1 text-xs text-white ${getRarityColor(
                    dino.rarity
                    )}`}
                    >
                    {dino.rarity}
                    </div>
                  )} */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const getTraitBadgeColor = (trait: string) => {
  switch (trait) {
    // Colors
    case "Amethyst":
      return "bg-purple-500";
    case "Aqua":
      return "bg-sky-600";
    case "Charcoal":
      return "bg-zinc-700";
    case "Desert":
      return "bg-yellow-500";
    case "Mist":
      return "bg-slate-400";
    case "Spring":
      return "bg-rose-400";
    case "Tropic":
      return "bg-emerald-500";
    case "Volcanic":
      return "bg-red-600";
    // Skins
    case "Toxic":
      return "bg-lime-600";
    case "Jurassic":
      return "bg-green-600";
    case "Mirage":
      return "bg-pink-400";
    case "Amazonia":
      return "bg-teal-600";
    case "Elektra":
      return "bg-indigo-600";
    case "Cristalline":
      return "bg-emerald-600";
    case "Coral":
      return "bg-cyan-600";
    case "Apres":
      return "bg-purple-800";
    case "Savanna":
      return "bg-orange-400";
    case "Oceania":
      return "bg-blue-700";
    // Backgrounds
    case "Peach":
      return "bg-orange-400";
    case "Mint":
      return "bg-emerald-400";
    case "Sky":
      return "bg-sky-400";
    case "Dune":
      return "bg-orange-300";
    case "Lavender":
      return "bg-fuchsia-300";
    case "Salmon":
      return "bg-red-400";
    // Default
    default:
      return "bg-slate-100";
  }
};

const getColor = (matches: string) => {
  const color = matches.split("_")[1];
  switch (color) {
    case "Amethyst":
      return "border-purple-500";
    case "Aqua":
      return "border-sky-600";
    case "Charcoal":
      return "border-zinc-500";
    case "Desert":
      return "border-yellow-500";
    case "Mist":
      return "border-slate-300";
    case "Spring":
      return "border-rose-300";
    case "Tropic":
      return "border-emerald-500";
    case "Volcanic":
      return "border-red-600";
    default:
      return "border-slate-100";
  }
};

const getRarityColor = (rank: number) => {
  if (rank > 6088) return "bg-zinc-500";
  if (rank > 3564) return "bg-emerald-600";
  if (rank > 1531) return "bg-blue-400";
  if (rank > 505) return "bg-purple-600";
  if (rank > 102) return "bg-amber-500";
  return "bg-rose-600";
};
