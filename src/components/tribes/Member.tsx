import {
  type Telegram,
  type Attributes,
  type Dino,
  type Discord,
  type Twitter,
  type User,
  type Wallet,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { shortAccount } from "~/utils/addresses";
import ImageExpander from "./Expander";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { fetchOtherWallets } from "~/utils/subdaos";
import { handleUserPFPDoesNotExist } from "~/utils/images";
import { extractProfileFromUser } from "~/utils/wallet";

type MemberProps = {
  owner: string;
  data: {
    dinos: (Dino & { attributes: Attributes })[];
    user: User & {
      wallets: Wallet[];
      discord: Discord;
      twitter: Twitter;
      telegram: Telegram;
    };
  };
  acronym: string;
};

const Member = ({ data, owner, acronym }: MemberProps) => {
  const { dinos, user } = data;
  const [expanded, setExpanded] = useState(false);
  const [userDinos, setUserDinos] = useState<any>(dinos);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // const wallets =
  //   user?.wallets
  //     .map((wallet: Wallet) => wallet.address)
  //     .filter((address: string) => user?.defaultAddress !== address) ?? [];
  // const { otherWallets } = fetchOtherWallets(wallets);
  // useEffect(() => {
  //   if (wallets) {
  //     if (acronym !== "cc") return;
  //     const mintArray = otherWallets?.flatMap((item) => item.mints);
  //     if (mintArray) {
  //       setUserDinos([...dinos, ...mintArray]);
  //     }
  //   }
  // }, [wallets]);

  const isRegistered =
    user?.discord ||
    user?.twitter ||
    (user?.telegram && user?.telegram.isActive);
  const expandable = userDinos ? userDinos.length > 1 : dinos.length > 1;
  const additionalDinos = userDinos ? userDinos.length - 1 : dinos.length - 1;
  const isUnowned = owner === "unowned";

  const { username, userHandle, userPFP, favoriteDomain } =
    extractProfileFromUser(user);

  const avatar =
    userPFP ?? `https://ui-avatars.com/api/?name=${owner}&background=random`;

  const profile = username ?? owner;

  const name = userHandle
    ? userHandle
    : favoriteDomain
    ? `${favoriteDomain}.sol`
    : isUnowned
    ? "Listed/Unowned"
    : shortAccount(owner);

  return (
    <div
      className={`rounded-lg bg-neutral-800 p-3 pb-1 md:p-4 ${
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
          className={`flex flex-row flex-nowrap items-center sm:flex-row ${
            expanded ? `justify-center` : `flex-col justify-center`
          }  gap-1 py-1 md:gap-4 md:pt-2`}
        >
          <Link
            href={`/inventory/${profile}`}
            className={`flex ${
              !expanded && `w-full`
            } flex-row items-center justify-start gap-1 overflow-hidden rounded-lg px-2 py-1 hover:bg-stone-700`}
          >
            <div className="relative aspect-square h-6 w-6 md:h-8 md:w-8">
              <Image
                className="self-center rounded-full"
                src={avatar}
                alt="Avatar"
                fill
                onError={handleUserPFPDoesNotExist}
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
                  className="flex h-8 flex-row flex-nowrap justify-center gap-1 rounded-lg bg-neutral-700 px-2 py-1 align-middle text-xs font-extrabold hover:bg-neutral-600"
                >
                  <div className="self-center">Hide</div>
                  <HiChevronUp className="self-center" />
                </button>
              ) : (
                <button
                  onClick={toggleExpand}
                  className="flex h-8 w-full flex-nowrap justify-center gap-1 rounded-md bg-neutral-700 px-2 py-1 align-middle text-xs font-extrabold hover:bg-neutral-600 md:w-fit"
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

export default Member;
