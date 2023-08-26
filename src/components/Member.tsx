import {
  Attributes,
  Dino,
  Discord,
  Twitter,
  User,
  Wallet,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { shortAccount } from "~/utils/addresses";
import { api } from "~/utils/api";
import ImageExpander from "./Expander";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { fetchOtherWallets } from "~/utils/subdaos";

type MemberProps = {
  owner: string;
  data: {
    dinos: (Dino & { attributes: Attributes })[];
    user: User & { wallets: Wallet[]; discord: Discord; twitter: Twitter };
  };
  acronym: string;
};

export const Member = ({ data, owner, acronym }: MemberProps) => {
  const { dinos, user } = data;
  const [expanded, setExpanded] = useState(false);
  const [userDinos, setUserDinos] = useState<any>(dinos);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const wallets =
    user?.wallets
      .map((wallet: any) => wallet.address)
      .filter((address: any) => user?.defaultAddress !== address) ?? [];

  const otherWallets = fetchOtherWallets(wallets, acronym);

  useEffect(() => {
    if (wallets) {
      if (acronym !== "CC") return;
      const mintArray = otherWallets?.flatMap((item) => item.mints);
      if (mintArray) {
        setUserDinos([...dinos, ...mintArray]);
      }
    }
  }, [wallets]);

  const isRegistered = user?.discord || user?.twitter;
  const expandable = userDinos ? userDinos.length > 1 : dinos.length > 1;
  const additionalDinos = userDinos ? userDinos.length - 1 : dinos.length - 1;
  const isUnowned = owner === "unowned";

  const avatar = user?.discord
    ? user.discord.image_url
    : user?.twitter
    ? user?.twitter.image_url
    : `https://ui-avatars.com/api/?name=${owner}&background=random`;

  const profile = user?.discord
    ? user?.discord.username
    : user?.twitter
    ? user?.twitter.username
    : owner;

  const name = user?.discord
    ? user?.discord.global_name
    : user?.twitter
    ? user?.twitter.global_name
    : isUnowned
    ? "Listed/Unowned"
    : shortAccount(owner);

  return (
    <div
      className={`rounded-lg bg-stone-800 p-3 pb-1 md:p-4 ${
        isRegistered && `order-first`
      } ${!expanded && `transform-gpu transition-transform hover:scale-95`} ${
        expanded && `col-span-2 py-4 md:col-span-3 lg:col-span-5`
      }`}
    >
      <ImageExpander
        dinos={userDinos ? userDinos : dinos}
        expanded={expanded}
      />
      <div className={`${expanded ? `mt-2` : `mt-0 md:mt-1`}`}>
        <div
          className={`flex flex-col flex-nowrap items-center md:flex-row ${
            expanded ? `justify-center` : `justify-between`
          } gap-1 py-1 md:gap-4 md:pt-2`}
        >
          <Link
            href={`/profile/${profile}`}
            className="flex w-2/3 flex-row items-center justify-start gap-1 overflow-hidden rounded-lg px-2 py-1 hover:bg-stone-700"
          >
            <div className="relative aspect-square h-6 w-6 md:h-8 md:w-8">
              <Image
                className="self-center rounded-full"
                src={avatar}
                alt="Avatar"
                fill
              />
            </div>
            <div className="md:text-md self-center overflow-ellipsis whitespace-nowrap p-1 text-sm font-extrabold text-white">
              {name}
            </div>
          </Link>
          {expandable && (
            <>
              {expanded ? (
                <button
                  onClick={toggleExpand}
                  className="flex h-8 flex-row flex-nowrap justify-center gap-1 rounded-lg bg-stone-700 px-2 py-1 align-middle text-xs font-extrabold hover:bg-stone-600"
                >
                  <div className="self-center">Hide</div>
                  <HiChevronUp className="self-center" />
                </button>
              ) : (
                <button
                  onClick={toggleExpand}
                  className="flex h-8 w-full flex-nowrap justify-center gap-1 rounded-md bg-stone-700 px-2 py-1 align-middle text-xs font-extrabold hover:bg-stone-600 md:w-fit"
                >
                  <div className="self-center whitespace-nowrap">
                    {additionalDinos} more
                  </div>
                  <HiChevronDown className="self-center" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
