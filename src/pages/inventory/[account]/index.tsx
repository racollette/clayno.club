import { useEffect, useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Item from "../../../components/inventory/Item";
import { sortByRarity, type Character } from "~/utils/sort";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { sortByAttribute } from "~/utils/sort";
import { useRouter } from "next/router";
import { useFetchUserWallets } from "~/hooks/useFetchUserWallets";
import { groupByColor, groupByEdition, groupBySymbol } from "~/utils/inventory";
import { HiRefresh } from "react-icons/hi";
import { zip } from "~/utils/zip";
import MetaTags from "~/components/MetaTags";
import { HiExternalLink, HiReply } from "react-icons/hi";
import { shortAccount } from "~/utils/addresses";
import { getQueryString } from "~/utils/routes";
import { useSession } from "next-auth/react";
import { extractProfileFromUser } from "~/utils/wallet";
import { handleUserPFPDoesNotExist } from "~/utils/images";
import type { SubDAO } from "@prisma/client";
import { Skeleton } from "~/@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/ui/dialog";

const SAGA_ANCIENTS = [
  "8845gLdhgx1dtm2NSKSPEW5SWoZwQRGcT3vS9bMCkWQX", // Kim
  "12rDcQBjjB4i1x7wzSxaSyhdEMBhwWaEeG8JHS3se4fb", // Kyle
  "Dt3XDSAdXAJbHqvuycgCTHykKCC7tntMFGMmSvfBbpTL", // Midas Para
  "Begwd6UB99zLnTjqyy3oTvdvLAcvEJKa6Y3iGxypGrCu", // Midas Spino
];

const InventorySkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header Skeleton */}
      <div className="flex flex-col rounded-xl bg-neutral-800 p-3 md:flex-row md:items-center md:justify-between md:p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-full md:h-[65px] md:w-[65px]" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center gap-2">
                <div className="mx-1 h-4 w-px bg-neutral-700" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 md:mt-0">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-6 md:h-10 md:w-10" />
          ))}
        </div>
      </div>

      {/* Content Skeletons */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const router = useRouter();
  const { account } = router.query;
  const { data: session } = useSession();

  const { wallets } = useFetchUserWallets(account) as {
    wallets: { address: string }[];
  };
  const queryString = getQueryString(account);

  const { data: user, isLoading: isUserLoading } = api.binding.getUser.useQuery(
    {
      type: account && account.length > 32 ? "wallet" : "discord",
      id: queryString,
    }
  );

  const { userHandle, userPFP, favoriteDomain } = extractProfileFromUser(user);

  const authWallet = wallets.some(
    (item) => item.address === session?.user.name
  );

  const isOwner =
    session &&
    (session.user.name === user?.discord?.username ||
      session?.user.name === user?.twitter?.username ||
      session?.user.username === user?.telegram?.username ||
      authWallet);

  const [originalSpecies, setOriginalSpecies] = useState<Character[]>([]);
  const [sagaSpecies, setSagaSpecies] = useState<Character[]>([]);
  const [displayMode, setDisplayMode] = useState<"gif" | "pfp" | "class">(
    "gif"
  );

  // const favoriteDomain = getFavoriteDomain(wallets)

  const { data: holders, isLoading } = api.inventory.getUserItems.useQuery({
    wallets: wallets,
  });

  let dinos = holders?.[0]?.mints;
  let clay = holders?.[0]?.clay;
  let claymakers = holders?.[0]?.claymakers;
  let cosmetics = holders?.[0]?.cosmetics;

  if (holders) {
    for (let i = 1; i < holders.length; i++) {
      if (holders[i] && holders?.[i]?.mints) {
        dinos = dinos?.concat(holders?.[i]?.mints ?? []);
        claymakers = claymakers?.concat(holders?.[i]?.claymakers ?? []);
        clay = clay?.concat(holders?.[i]?.clay ?? []);
        cosmetics = cosmetics?.concat(holders?.[i]?.cosmetics ?? []);
      }
    }
  }

  const { data: userTribes } = api.subdao.getUserSubDAOs.useQuery(
    {
      wallets: wallets.length > 0 ? wallets : [queryString],
    },
    {
      enabled: !!(wallets.length > 0 || queryString),
    }
  );

  useEffect(() => {
    const originalSpecies = dinos?.filter(
      (dino) =>
        dino?.attributes?.species !== "Spino" &&
        dino?.attributes?.species !== "Para" &&
        !SAGA_ANCIENTS.includes(dino.mint)
    );

    setOriginalSpecies(originalSpecies ?? []);

    const sagaSpecies = dinos?.filter(
      (dino) =>
        dino?.attributes?.species === "Spino" ||
        dino?.attributes?.species === "Para" ||
        SAGA_ANCIENTS.includes(dino.mint)
    );
    setSagaSpecies(sagaSpecies ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSort = (attribute: string) => {
    if (attribute === "rarity") {
      setOriginalSpecies(sortByRarity(originalSpecies));
      setSagaSpecies(sortByRarity(sagaSpecies));
    }

    const originalSorted = sortByAttribute([...originalSpecies], attribute);
    if (attribute === "class") {
      originalSorted.reverse();
    }
    setOriginalSpecies(originalSorted);

    const sagaSorted = sortByAttribute([...sagaSpecies], attribute);
    setSagaSpecies(sagaSorted);

    if (attribute === "class") {
      setDisplayMode("class");
    } else {
      setDisplayMode("gif");
    }
  };

  return (
    <>
      <MetaTags title="Clayno.club | Inventory" />
      <Layout>
        <section className="flex flex-col items-center justify-center gap-y-8 md:container md:p-2">
          {isLoading || isUserLoading ? (
            <InventorySkeleton />
          ) : (
            <>
              <div className="w-full">
                <div className="flex flex-col rounded-xl bg-neutral-800 p-3 md:flex-row md:items-center md:justify-between md:p-4">
                  <div className="flex items-start gap-3 md:flex-row md:items-center md:gap-4">
                    {/* Profile Image and Name Group */}
                    <div className="flex gap-3">
                      <Image
                        className="h-10 w-10 rounded-full md:h-[65px] md:w-[65px]"
                        src={
                          userPFP ??
                          `https://ui-avatars.com/api/?name=${queryString}&background=random&size=300`
                        }
                        alt="Avatar"
                        width={65}
                        height={65}
                        priority
                        onError={handleUserPFPDoesNotExist}
                      />

                      {/* Name and Marketplace Links */}
                      <div className="flex flex-col justify-center gap-1 md:gap-2">
                        <div className="flex items-center gap-2">
                          <div className="font-clayno text-lg md:text-xl">
                            {userHandle
                              ? userHandle
                              : favoriteDomain
                              ? `${favoriteDomain}.sol`
                              : shortAccount(queryString)}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="mx-1 h-4 w-px bg-neutral-700 md:mx-2 md:h-5" />
                            <Link
                              href={`https://tensor.trade/portfolio?wallet=${wallets[0]}`}
                              target="_blank"
                              className="flex items-center"
                            >
                              <Image
                                src="/icons/tensor.svg"
                                width={20}
                                height={20}
                                alt="Tensor"
                                className="hover:scale-125 md:h-[22px] md:w-[22px]"
                              />
                            </Link>
                            <Link
                              href={`https://magiceden.io/u/${wallets[0]}`}
                              target="_blank"
                              className="flex items-center"
                            >
                              <Image
                                src="/icons/magic_eden.svg"
                                width={20}
                                height={20}
                                alt="Magic Eden"
                                className="hover:scale-125 md:h-[22px] md:w-[22px]"
                              />
                            </Link>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                          {user?.discord && (
                            <div className="flex items-center gap-1 md:gap-2">
                              <Image
                                src="/icons/discord.svg"
                                alt="Discord"
                                width={16}
                                height={16}
                                className="md:h-5 md:w-5"
                              />
                              <span>{user.discord.username}</span>
                            </div>
                          )}
                          {user?.twitter && !user.twitter.private && (
                            <Link
                              href={`https://twitter.com/${user.twitter.username}`}
                              target="_blank"
                              className="flex items-center gap-1 hover:text-blue-400 md:gap-2"
                            >
                              <Image
                                src="/icons/twitter.svg"
                                alt="Twitter"
                                width={16}
                                height={16}
                                className="md:h-5 md:w-5"
                              />
                              <span>@{user.twitter.username}</span>
                            </Link>
                          )}
                          {user?.telegram && !user.telegram.private && (
                            <Link
                              href={`https://t.me/${user.telegram.username}`}
                              target="_blank"
                              className="flex items-center gap-1 hover:text-blue-400 md:gap-2"
                            >
                              <Image
                                src="/icons/telegram.svg"
                                alt="Telegram"
                                width={16}
                                height={16}
                                className="md:h-5 md:w-5"
                              />
                              <span>@{user.telegram.username}</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tribes Section */}
                  {userTribes && userTribes.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 md:mt-0 md:gap-2">
                      {userTribes.map((tribe: SubDAO, index: number) => (
                        <Link
                          key={index}
                          href={`/tribes/${tribe.acronym}`}
                          className="group relative"
                        >
                          <div className="relative h-6 w-6 md:h-10 md:w-10">
                            <Image
                              src={tribe.thumbnail ?? ""}
                              alt={tribe.name}
                              fill
                              className="rounded-md transition-all hover:scale-110"
                            />
                          </div>
                          <span className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs group-hover:block">
                            {tribe.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 flex w-full flex-col gap-4">
                <div className="flex flex-row justify-between">
                  <div className="font-clayno text-lg text-white md:text-2xl">
                    Claynosaurz {`(${originalSpecies?.length})`}
                  </div>
                  <div>
                    <Select onValueChange={(v) => handleSort(v)}>
                      <SelectTrigger className="w-[100px] bg-black font-clayno text-sm text-white md:w-[180px]">
                        <SelectValue placeholder="Rarity" />
                      </SelectTrigger>
                      <SelectContent className="bg-black font-clayno text-sm text-white">
                        <SelectItem value="rarity">Rarity</SelectItem>
                        <SelectItem value="class">Class</SelectItem>
                        <SelectItem value="species">Species</SelectItem>
                        <SelectItem value="skin">Skin</SelectItem>
                        <SelectItem value="color">Color</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                  {originalSpecies?.map((dino: any) => (
                    <div key={dino.mint}>
                      <Item
                        item={dino}
                        type={"dino"}
                        displayMode={displayMode}
                      />
                    </div>
                  ))}
                  {originalSpecies?.length > 1 && (
                    <div className="flex aspect-square flex-col items-center justify-center rounded-md">
                      <DownloadButton
                        data={originalSpecies}
                        options={[
                          {
                            type: "gif",
                            label: "GIFs",
                            backgroundColor: "bg-pink-500",
                          },
                          {
                            type: "pfp",
                            label: "PFPs",
                            backgroundColor: "bg-cyan-600",
                          },
                          {
                            type: "class",
                            label: "Classes",
                            backgroundColor: "bg-purple-600",
                            filter: (dino) => dino.classPFP !== null,
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
                <div className="font-clayno text-lg text-white md:text-2xl">
                  Call of Saga {`(${sagaSpecies?.length})`}
                </div>
                <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                  {sagaSpecies?.map((dino: any) => (
                    <div key={dino.mint}>
                      <Item item={dino} type={"dino"} />
                    </div>
                  ))}
                  {sagaSpecies?.length > 1 && (
                    <div className="flex aspect-square flex-col items-center justify-center rounded-md">
                      <DownloadButton
                        data={sagaSpecies}
                        options={[
                          {
                            type: "gif",
                            label: "GIFs",
                            backgroundColor: "bg-pink-500",
                          },
                          {
                            type: "pfp",
                            label: "PFPs",
                            backgroundColor: "bg-cyan-600",
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
                <div className="font-clayno text-lg text-white md:text-2xl">
                  Clay {`(${clay?.length})`}
                </div>
                <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                  {clay && (
                    <>
                      {Object.keys(groupByColor(clay)).map((color) => {
                        const firstClay = groupByColor(clay ?? [])[color][0];
                        const colorCount = groupByColor(clay ?? [])[color]
                          .length;
                        return (
                          <div
                            key={color}
                            className="relative flex flex-row flex-wrap gap-2"
                          >
                            <Item item={firstClay} type={"clay"} />
                            <p className="absolute left-2 top-2 font-clayno text-2xl text-white">
                              {colorCount}
                            </p>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
                <div className="font-clayno text-lg text-white md:text-2xl">
                  Claymakers {`(${claymakers?.length})`}
                </div>
                <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                  {claymakers && (
                    <>
                      {Object.keys(groupByEdition(claymakers)).map(
                        (edition) => {
                          if (edition === "First" || edition === "Limited") {
                            const firstClaymaker = groupByEdition(
                              claymakers ?? []
                            )[edition][0];
                            const editionCount = groupByEdition(
                              claymakers ?? []
                            )[edition].length;
                            return (
                              <div
                                key={edition}
                                className="relative order-first flex flex-row flex-wrap gap-2"
                              >
                                <Item
                                  item={firstClaymaker}
                                  type={"claymaker"}
                                />
                                <p className="absolute left-2 top-2 font-clayno text-2xl text-white">
                                  {editionCount}
                                </p>
                              </div>
                            );
                          }

                          return (
                            <>
                              {groupByEdition(claymakers ?? [])["Deluxe"].map(
                                (claymaker: any) => (
                                  <div
                                    key={claymaker.mint}
                                    className="relative"
                                  >
                                    <Item item={claymaker} type={"claymaker"} />
                                    <p className="absolute bottom-2 right-2 font-clayno text-xl text-white">
                                      {claymaker.charges}/5
                                    </p>
                                  </div>
                                )
                              )}
                            </>
                          );
                        }
                      )}
                    </>
                  )}
                </div>
                <div className="font-clayno text-lg text-white md:text-2xl">
                  Cosmetics {`(${cosmetics?.length})`}
                </div>
                <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                  {cosmetics && (
                    <>
                      {[...cosmetics]
                        .sort((a, b) =>
                          (a.name ?? "").localeCompare(b.name ?? "")
                        )
                        .map((cosmetic) => (
                          <div
                            key={cosmetic.mint}
                            className="relative flex flex-row flex-wrap gap-2"
                          >
                            <Item item={cosmetic} type={"cosmetic"} />
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </Layout>
    </>
  );
};

export default Inventory;

type DownloadOption = {
  type: string;
  label: string;
  backgroundColor: string;
  filter?: (item: Character) => boolean;
};

function DownloadButton({
  data,
  options,
}: {
  data: Character[];
  options: DownloadOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleDownload = async (items: Character[], type: string) => {
    setIsDownloading(true);
    setSelectedType(type);
    await zip(items, type);
    setIsDownloading(false);
    setSelectedType(null);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="group relative aspect-square w-full overflow-hidden rounded-md bg-neutral-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={data[0]?.gif || data[0]?.image}
                alt="Preview"
                fill
                className="object-cover opacity-50 transition-transform group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="font-clayno text-sm text-white">
                Download All
              </span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="border-0 bg-neutral-900 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-clayno text-lg text-white">
              Download Options
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-4">
            {options.map((option) => {
              const filteredData = option.filter
                ? data.filter(option.filter)
                : data;
              if (option.filter && filteredData.length === 0) return null;

              return (
                <button
                  key={option.type}
                  onClick={() => handleDownload(filteredData, option.type)}
                  disabled={isDownloading}
                  className={`w-full rounded-lg px-4 py-2 font-clayno text-white transition-all ${
                    option.backgroundColor
                  } ${
                    isDownloading
                      ? "opacity-50"
                      : "hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                  }`}
                >
                  {isDownloading && selectedType === option.type ? (
                    <div className="flex items-center justify-center gap-2">
                      <span>Fetching</span>
                      <HiRefresh className="animate-spin" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>{option.label}</span>
                      <span className="text-xs opacity-75">
                        ({filteredData.length})
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
