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

const SAGA_ANCIENTS = [
  "8845gLdhgx1dtm2NSKSPEW5SWoZwQRGcT3vS9bMCkWQX", // Kim
  "12rDcQBjjB4i1x7wzSxaSyhdEMBhwWaEeG8JHS3se4fb", // Kyle
  "Dt3XDSAdXAJbHqvuycgCTHykKCC7tntMFGMmSvfBbpTL", // Midas Para
  "Begwd6UB99zLnTjqyy3oTvdvLAcvEJKa6Y3iGxypGrCu", // Midas Spino
];

const Inventory = () => {
  const router = useRouter();
  const { account } = router.query;

  const { wallets } = useFetchUserWallets(account);

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
          <div className="relative flex w-full flex-row items-center justify-center gap-2">
            <Link href={`/inventory`} className="absolute left-0 top-2">
              <HiReply size={30} />
            </Link>
            <div className="flex flex-col gap-2">
              <div className="font-clayno text-lg md:text-2xl">
                {account
                  ? account.length > 36
                    ? `${shortAccount(getQueryString(account))}'s Inventory`
                    : `${account}'s Inventory`
                  : `Inventory`}
              </div>
              <div className="flex flex-row items-center justify-center gap-4">
                <Link
                  href={`/profile/${account}`}
                  className="text-md flex flex-row items-center justify-center gap-1 font-clayno hover:scale-125"
                >
                  <HiExternalLink size={16} className="inline-block" />
                  Profile
                </Link>
                <Link
                  href={`https://tensor.trade/portfolio?wallet=${wallets[0]}`}
                  target="_blank"
                >
                  <Image
                    src="/icons/tensor.svg"
                    width={24}
                    height={24}
                    alt="Tensor"
                    className="hover:scale-125"
                  />
                </Link>
                <Link
                  href={`https://magiceden.io/u/${wallets[0]}`}
                  target="_blank"
                >
                  <Image
                    src="/icons/magic_eden.svg"
                    width={24}
                    height={24}
                    alt="Magic Eden"
                    className="hover:scale-125"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4">
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
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {originalSpecies?.map((dino: any) => (
                <div key={dino.mint}>
                  <Item item={dino} type={"dino"} displayMode={displayMode} />
                </div>
              ))}
              {originalSpecies?.length > 1 && (
                <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md p-1 sm:h-28 sm:w-28 sm:gap-2 sm:p-2 lg:h-40 lg:w-40">
                  <p className="font-clayno text-[10px] text-white sm:text-xs lg:text-sm">
                    Download All
                  </p>
                  <DownloadButton
                    data={originalSpecies}
                    type="gif"
                    backgroundColor={`bg-pink-500`}
                  />
                  <DownloadButton
                    data={originalSpecies}
                    type="pfp"
                    backgroundColor={`bg-cyan-600`}
                  />
                  <DownloadButton
                    data={originalSpecies.filter(
                      (dino) => dino.classPFP !== null
                    )}
                    type="class"
                    backgroundColor={`bg-purple-600`}
                  />
                </div>
              )}
            </div>
            <div className="font-clayno text-lg text-white md:text-2xl">
              Call of Saga {`(${sagaSpecies?.length})`}
            </div>
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {sagaSpecies?.map((dino: any) => (
                <div key={dino.mint}>
                  <Item item={dino} type={"dino"} />
                </div>
              ))}
              {sagaSpecies?.length > 1 && (
                <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md p-1 sm:h-28 sm:w-28 sm:gap-2 sm:p-2 lg:h-40 lg:w-40">
                  <p className="font-clayno text-[10px] text-white sm:text-xs lg:text-sm">
                    Download All
                  </p>
                  <DownloadButton
                    data={sagaSpecies}
                    type="gif"
                    backgroundColor={`bg-pink-500`}
                  />
                  <DownloadButton
                    data={sagaSpecies}
                    type="pfp"
                    backgroundColor={`bg-cyan-600`}
                  />
                </div>
              )}
            </div>
            <div className="font-clayno text-lg text-white md:text-2xl">
              Clay {`(${clay?.length})`}
            </div>
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {/* Grouping clays by color */}
              {clay && (
                <>
                  {Object.keys(groupByColor(clay)).map((color) => {
                    const firstClay = groupByColor(clay ?? [])[color][0];
                    const colorCount = groupByColor(clay ?? [])[color].length;
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
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {/* Grouping clays by color */}
              {claymakers && (
                <>
                  {Object.keys(groupByEdition(claymakers)).map((edition) => {
                    if (edition === "First" || edition === "Limited") {
                      const firstClaymaker = groupByEdition(claymakers ?? [])[
                        edition
                      ][0];
                      const editionCount = groupByEdition(claymakers ?? [])[
                        edition
                      ].length;
                      return (
                        <div
                          key={edition}
                          className="relative order-first flex flex-row flex-wrap gap-2"
                        >
                          <Item item={firstClaymaker} type={"claymaker"} />
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
                            <div key={claymaker.mint} className="relative">
                              <Item item={claymaker} type={"claymaker"} />
                              <p className="absolute bottom-2 right-2 font-clayno text-xl text-white">
                                {claymaker.charges}/5
                              </p>
                            </div>
                          )
                        )}
                      </>
                    );
                  })}
                </>
              )}
            </div>
            <div className="font-clayno text-lg text-white md:text-2xl">
              Cosmetics {`(${cosmetics?.length})`}
            </div>
            <div className="mb-8 flex flex-row flex-wrap gap-2">
              {cosmetics && (
                <>
                  {[...cosmetics]
                    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
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
        </section>
      </Layout>
    </>
  );
};

export default Inventory;

function DownloadButton({
  data,
  type,
  backgroundColor,
}: {
  data: Character[];
  type: string;
  backgroundColor: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (items: Character[], type: string) => {
    setIsDownloading(true);
    console.log(items);
    await zip(items, type);
    setIsDownloading(false);
  };

  return (
    <button
      onClick={() => handleDownload(data, type)}
      className={`w-full rounded-lg px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm ${backgroundColor}`}
    >
      {isDownloading ? (
        <div className="flex flex-row items-center justify-center gap-1">
          <p className="font-clayno">Fetching</p>
          <HiRefresh
            size={14}
            className="ml-1 inline-block animate-spin sm:ml-2 sm:text-base"
          />
        </div>
      ) : (
        <p className="font-clayno">
          {type === "class" ? "Classes" : `${type}s`}
        </p>
      )}
    </button>
  );
}
