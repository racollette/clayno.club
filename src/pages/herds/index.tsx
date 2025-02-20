import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import TabSelection from "../../components/herds/TabSelection";
import Herd from "../../components/Herd";
import Image from "next/image";
import Link from "next/link";
import { useTimeSinceLastUpdate } from "~/hooks/useUpdated";
import { useSearchParams } from "next/navigation";
import type {
  Herd as HerdType,
  Attributes,
  Dino,
  User,
  Discord,
  Twitter,
  Wallet,
  Telegram,
} from "@prisma/client";
import { useUser } from "~/hooks/useUser";
import { useToast } from "~/@/components/ui/use-toast";
import { HiX, HiRefresh } from "react-icons/hi";
import FilterDialog from "../../components/herds/FilterDialog";
import MetaTags from "~/components/MetaTags";

type HerdWithIncludes =
  | HerdType & {
      dinos: (Dino & {
        attributes: Attributes | null;
      })[];
    };

// Custom hook to filter and sort herds
function filterHerds(
  allHerds: HerdWithIncludes[] | undefined,
  color: string | null,
  skin: string | null,
  background: string | null,
  tier: string | null,
  belly: string | null
): HerdWithIncludes[] {
  // Early return if allHerds is undefined or empty
  if (!allHerds?.length) return [];

  // First filter the herds
  const filteredHerds = allHerds.filter((herd): herd is HerdWithIncludes => {
    if (!herd?.matches) return false;

    const herdMatchesLower = herd.matches.toLowerCase();
    const colorFilter =
      !color || color === "all" || herdMatchesLower.includes(color);
    const skinFilter =
      !skin || skin === "all" || herdMatchesLower.includes(skin);
    const backgroundFilter =
      !background ||
      background === "all" ||
      herdMatchesLower.includes(background);
    const tierValue =
      tier === "insane"
        ? 0
        : tier === "perfect"
        ? 1
        : tier === "epic"
        ? 2
        : tier === "rare"
        ? 3
        : tier === "scrappy"
        ? 4
        : 0;
    const tierFilter =
      !tier || tier === "all" ? herd.tier !== 4 : herd.tier === tierValue;
    const bellyFilter =
      !belly || belly === "all" || herdMatchesLower.includes(belly);

    return (
      colorFilter && skinFilter && backgroundFilter && tierFilter && bellyFilter
    );
  });

  // Create separate arrays for each tier group
  const topTierHerds = filteredHerds.filter((h) => h.tier <= 2);
  const rareHerds = filteredHerds.filter((h) => h.tier === 3);
  const scrappyHerds = filteredHerds.filter((h) => h.tier === 4);

  // Sort top tier herds by rarity with randomization
  const sortedTopTier = [...topTierHerds].sort((a, b) => {
    const rarityDiff = a.rarity - b.rarity;
    const aRandomFactor = Math.random() * (a.rarity + 1);
    const bRandomFactor = Math.random() * (b.rarity + 1);
    return rarityDiff + (aRandomFactor - bRandomFactor);
  });

  // Function to shuffle an array
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
    return shuffled;
  }

  // Combine all groups in order, ensuring each array exists
  return [
    ...sortedTopTier,
    ...shuffleArray(rareHerds),
    ...shuffleArray(scrappyHerds),
  ];
}

function useHerdOwners(walletAddresses: string[]) {
  // const allHerdOwnersQuery = api.binding.getUsersByWalletAddresses.useQuery({
  //   walletAddresses,
  // });
  const { data, isError, isLoading } = api.binding.getAllUsers.useQuery();
  return { data, isError, isLoading };
}

export default function Home() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { data: allHerds, isLoading: allHerdsLoading } =
    api.herd.getAllHerds.useQuery();
  const { data: myHerds } = api.herd.getUserHerds.useQuery(
    user?.wallets.map((w) => w.address) ?? [],
    {
      enabled: !!user?.wallets.length,
    }
  );
  const utils = api.useContext();

  const color = searchParams.get("color") || "all";
  const skin = searchParams.get("skin") || "all";
  const background = searchParams.get("background") || "all";
  const tier = searchParams.get("tier") || "all";
  // switch 'on' to 'belly' for display purposes
  const belly = searchParams.get("belly") === "on" ? "belly" : "all";

  const [showDactyl, setShowDactyl] = useState(true);
  const [showSaga, setShowSaga] = useState(true);
  const [showPFP, setShowPFP] = useState(false);
  const [showMyHerds, setShowMyHerds] = useState(false);

  const [filteredHerds, setFilteredHerds] = useState<
    HerdWithIncludes[] | undefined
  >(filterHerds(allHerds, color, skin, background, tier, belly));

  const allHerdAddressesSet = new Set(allHerds?.map((herd) => herd.owner));
  const allHerdAddresses = [...allHerdAddressesSet];

  const { data: owners } = useHerdOwners(allHerdAddresses);

  useEffect(() => {
    setFilteredHerds(allHerds);
  }, [allHerds]);

  useEffect(() => {
    if (allHerds && !allHerdsLoading) {
      let filtered = filterHerds(
        allHerds,
        color,
        skin,
        background,
        tier,
        belly
      );

      // Filter for user's herds if toggle is on
      if (showMyHerds && user?.wallets) {
        const userAddresses = user.wallets.map((wallet) => wallet.address);
        filtered = filtered.filter((herd) =>
          userAddresses.includes(herd.owner)
        );
      }

      setFilteredHerds(filtered);
    }
  }, [
    color,
    background,
    skin,
    tier,
    belly,
    allHerds,
    allHerdsLoading,
    showMyHerds,
    user?.wallets,
  ]);

  const toggleDactyl = (newToggleState: boolean) => {
    setShowDactyl(newToggleState);
  };

  const toggleSaga = (newToggleState: boolean) => {
    setShowSaga(newToggleState);
  };

  const togglePFP = (newToggleState: boolean) => {
    setShowPFP(newToggleState);
  };

  const lastUpdated = useTimeSinceLastUpdate("herds");
  const filtersActive = [color, skin, background, tier, belly].filter(
    (filter) => filter !== "all"
  ).length;
  const filteredResults =
    !allHerdsLoading && filteredHerds && filteredHerds?.length > 0
      ? filteredHerds?.length
      : 0;

  // Use the appropriate herds based on the toggle
  const displayHerds = showMyHerds
    ? myHerds
    : allHerds?.filter((herd) => herd.type !== "Null");

  return (
    <>
      <MetaTags
        title="Claynosaurz Herds | Clayno Club"
        description="Who has the finest herd of Claynotopia? Find the most popular Claynosaurz collections."
      />
      <main className="relative flex min-h-screen flex-col items-center  bg-black">
        {allHerdsLoading ? (
          <div className="relative mb-24 aspect-square w-1/2 overflow-clip rounded-full text-white md:w-1/4">
            <Image
              src="/gifs/TTT.gif"
              alt="Loading"
              fill
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center py-2 md:px-4">
            {/* <div className="flex w-full flex-col flex-wrap items-center justify-center p-2">
              <div className="relative aspect-video w-full p-4 md:w-1/2">
                <Image
                  className="rounded-lg"
                  src="/images/3d_herd.jpeg"
                  alt="Claynosaurz"
                  quality={100}
                  fill
                />
                <div className="absolute right-0 top-0 hidden h-full w-3/5 items-start justify-end md:flex">
                  <div className="m-4 flex max-w-lg flex-col gap-4 rounded-xl bg-black/70 p-8 text-white hover:bg-black/30">
                    <h2 className="text-xl font-extrabold text-white md:text-2xl">
                      Dino{" "}
                      <span className="text-[hsl(192,100%,70%)]">Herds</span>
                    </h2>
                    <div className="md:text-md text-sm">
                      <p className="pb-2">
                        A herd is a collection containing one of each of the six
                        original Claynosaurz species.
                      </p>
                      <p>The more matching traits the better!</p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-0 top-0 flex h-full w-full items-start justify-end md:hidden">
                  <div className="m-5 flex max-w-lg flex-col rounded-xl bg-black/70 px-4 py-3 text-white hover:bg-black/30">
                    <h2 className="text-xl font-extrabold text-white">
                      Dino{" "}
                      <span className="text-[hsl(280,100%,70%)]">Herds</span>
                    </h2>
                  </div>
                </div>
                <div className="absolute -bottom-5 -right-0 pt-2 text-right text-xs italic text-zinc-500">
                  {`Updated ${lastUpdated}`}
                </div>
              </div>
            </div> */}

            <section className="flex flex-row items-center justify-center gap-2 p-2 text-white md:gap-4 md:p-4">
              <div className="flex flex-row items-center gap-2">
                <FilterDialog
                  color={color}
                  skin={skin}
                  background={background}
                  tier={tier}
                  belly={belly}
                  className="flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 font-medium hover:bg-neutral-700"
                />

                {user && (
                  <button
                    onClick={() => setShowMyHerds(!showMyHerds)}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
                      showMyHerds
                        ? "bg-neutral-800 text-cyan-400"
                        : "bg-neutral-800 text-white"
                    } hover:bg-neutral-700`}
                  >
                    {showMyHerds ? "All Herds" : "My Herds"}
                  </button>
                )}
              </div>

              {filtersActive > 0 && (
                <div className="flex flex-row flex-nowrap rounded-md bg-red-700 p-2 hover:bg-red-500">
                  <Link
                    href={`?skin=all&color=all&background=all&tier=all`}
                    className="flex flex-row flex-nowrap items-center justify-center gap-2 text-sm font-bold text-white"
                  >
                    [{filtersActive}]
                    <HiX size={20} className="text-white" />
                  </Link>
                </div>
              )}

              <div className="text-sm font-bold text-white">
                <div>
                  {filteredResults} herd{filteredResults !== 1 && "s"}
                </div>
              </div>

              <div className="hidden text-right text-xs italic text-zinc-500 md:block">
                {`Updated ${lastUpdated}`}
              </div>
            </section>

            <section className="w-full md:w-4/5 lg:w-2/3 xl:w-3/5 2xl:w-1/2">
              <TabSelection
                labels={["Top Tier", "Rare", "Scrappy"]}
                counts={[
                  filteredHerds?.filter((h) => h.tier <= 2).length ?? 0,
                  filteredHerds?.filter((h) => h.tier === 3).length ?? 0,
                  filteredHerds?.filter((h) => h.tier === 4).length ?? 0,
                ]}
                showDactyl={showDactyl}
                showSaga={showSaga}
                showPFP={showPFP}
                toggleDactyl={toggleDactyl}
                toggleSaga={toggleSaga}
                togglePFP={togglePFP}
              >
                <div className="mt-4 flex flex-col items-center justify-center gap-2">
                  {filteredResults === 0 && (
                    <div className="mt-10 flex flex-col items-center justify-center gap-2">
                      {allHerdsLoading ? (
                        <HiRefresh
                          size={50}
                          className="animate-spin text-white"
                        />
                      ) : (
                        <>
                          <Image
                            src="/images/travolta.gif"
                            width={200}
                            height={200}
                            alt="???"
                            className="rounded-lg"
                          />
                          <p className="font-semibold text-white">
                            No herds found!
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {displayHerds?.map((herd) => {
                    const foundUser = owners?.find((user) => {
                      return user.wallets.some(
                        (wallet) => wallet.address === herd.owner
                      );
                    });
                    return (
                      <div
                        key={herd.id}
                        className="mb-6 flex w-full flex-col items-center md:flex-row md:gap-8"
                      >
                        <Herd
                          key={herd.id}
                          herd={herd as HerdWithIncludes}
                          showDactyl={showDactyl}
                          showSaga={showSaga}
                          showOwner={true}
                          showPFP={showPFP}
                          owner={foundUser}
                          currentUser={user}
                        />
                      </div>
                    );
                  })}
                </div>
              </TabSelection>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
