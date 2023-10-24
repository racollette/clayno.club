import type { Attributes, Dino, Herd } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { truncateAccount } from "~/utils/addresses";
import { api } from "~/utils/api";
import {
  getRarityColor,
  getTraitBadgeColor,
  getBorderColor,
} from "~/utils/colors";

// const coreSpecies = ["Rex", "Bronto", "Ankylo", "Raptor", "Trice", "Stego"];

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
};

export default function Herd(props: HerdProps) {
  const { herd, showDactyl, showSaga, showOwner, showPFP } = props;
  const [filteredHerd, setFilteredHerd] = useState(herd);

  const { data: owner } = api.binding.getUser.useQuery({
    type: "wallet",
    id: herd.owner,
  });

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

  // const discord: Discord = owner?.discord ? owner.discord : ""

  return (
    <div
      key={filteredHerd.id}
      className="mb-6 flex w-full flex-col rounded-lg bg-neutral-800 p-4 md:p-6"
    >
      <div
        className={`mb-1 flex flex-none flex-wrap items-center justify-between rounded-md  ${getBorderColor(
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
            {owner?.twitter || owner?.discord ? (
              <div className="mx-3 flex flex-row justify-center align-middle">
                <div className="mr-2 flex">
                  <Link
                    className="flex flex-row rounded-md px-2 py-2 text-white hover:bg-white/20"
                    href={`/profile/${
                      owner?.discord?.username || owner?.twitter?.username
                    }`}
                  >
                    <Image
                      className="mr-2 self-center rounded-md"
                      src={
                        owner?.discord?.image_url ||
                        owner?.twitter?.image_url ||
                        ""
                      }
                      alt="Avatar"
                      width={24}
                      height={24}
                    />
                    <div className="self-center text-white">
                      {owner?.discord?.global_name ||
                        owner?.twitter?.global_name}
                    </div>
                  </Link>
                </div>

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
        {filteredHerd.dinos.map((dino) => (
          <div key={dino.mint}>
            {dino.attributes && (
              <div
                key={dino.mint}
                className={`relative m-0.5 aspect-square overflow-clip rounded-md border-2${getBorderColor(
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
