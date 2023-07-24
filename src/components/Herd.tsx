import { Dino, Discord, Herd } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { truncateAccount } from "~/utils/addresses";
import { api } from "~/utils/api";

const coreSpecies = ["Rex", "Bronto", "Ankylo", "Raptor", "Trice", "Stego"];

type HerdProps = {
  herd: Herd;
  showDactyl: boolean;
  showSaga: boolean;
};

export default function Herd(props: HerdProps) {
  const { herd, showDactyl, showSaga } = props;

  const { data: owner, isLoading } = api.binding.getUser.useQuery({
    type: "wallet",
    id: herd.owner,
  });

  // const discord: Discord = owner?.discord ? owner.discord : ""

  return (
    <div key={herd.id} className="mb-6 flex flex-col">
      <div
        className={`mb-1 flex flex-none flex-wrap items-center justify-between rounded-md border-2 bg-white/10  ${getColor(
          herd.matches
        )}`}
      >
        {herd.tier !== 4 && (
          <div className="m-2 flex flex-row">
            {herd.matches.split("_").map((trait, index) => (
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
                {/* <Link
                    href={`https://discordapp.com/users/${owner.discord.username}`}
                    >
                    <Image
                    src="/icons/discord.svg"
                    alt="Discord"
                    width={24}
                    height={24}
                    />
                  </Link> */}
              </div>
            )}
            {owner.twitter && (
              <>
                {/* <Image
                    className="mr-2 rounded-md"
                    src={owner.twitter.image_url}
                    alt="Avatar"
                    width={24}
                    height={24}
                  />
                  <div className="text-white">{owner.twitter.global_name}</div> */}
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
              </>
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
          <Link
            className="m-1 rounded-md px-4 py-2 text-white hover:bg-white/20"
            href={`https://www.tensor.trade/portfolio?wallet=${herd.owner}&portSlug=claynosaurz`}
            target="_blank"
          >
            <div className={`md:text-md hidden font-bold  md:block`}>
              {herd.owner}
            </div>
            <div className={`text-md block font-bold text-white md:hidden`}>
              {truncateAccount(herd.owner)}
            </div>
          </Link>
        )}

        <div
          className={`mx-3 my-2 ml-auto rounded-md px-2 py-1 text-xs text-white md:ml-3 ${getRarityColor(
            herd.rarity
          )}`}
        >
          {herd.rarity}
        </div>
      </div>

      <div className={`flex flex-1 flex-wrap justify-center`} key={herd.id}>
        {/* @ts-ignore */}
        {herd.herd.map((dino) => (
          <div key={dino.mint}>
            {dino.attributes &&
              coreSpecies.includes(dino.attributes?.species) && (
                <div
                  key={dino.mint}
                  className={`relative m-0.5 h-40 w-40 overflow-clip rounded-md border-2 md:h-48 md:w-48 ${getColor(
                    herd.matches
                  )}`}
                >
                  <Image
                    src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
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
            {showDactyl && dino.attributes?.species === "Dactyl" ? (
              <div
                key={dino.mint}
                className={`relative m-0.5 h-40 w-40 overflow-clip rounded-md border-2 md:h-48 md:w-48 ${getColor(
                  herd.matches
                )}`}
              >
                <Image
                  src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                  alt="Clayno gif"
                  quality={100}
                  fill
                ></Image>
              </div>
            ) : null}
            {showSaga &&
              (dino.attributes?.species === "Para" ||
                dino.attributes?.species === "Spino") && (
                <div
                  key={dino.mint}
                  className={`relative m-0.5 h-40 w-40 overflow-clip rounded-md border-2 md:h-48 md:w-48 ${getColor(
                    herd.matches
                  )}`}
                >
                  <Image
                    src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                    alt="Clayno gif"
                    quality={100}
                    fill
                  ></Image>
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
