import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Herd from "../../components/herds/Herd";
import Link from "next/link";
import { useTimeSinceLastUpdate } from "~/hooks/useUpdated";
import { useSearchParams } from "next/navigation";
import type { Herd as HerdType, Attributes, Dino } from "@prisma/client";
import { useUser } from "~/hooks/useUser";
import { useToast } from "~/@/components/ui/use-toast";
import { HiX, HiRefresh, HiInformationCircle } from "react-icons/hi";
import FilterDialog from "../../components/herds/FilterDialog";
import MetaTags from "~/components/MetaTags";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/@/components/ui/dialog";
import ToggleSwitch from "../../components/ToggleSwitch";
import { Skeleton } from "~/@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import DinoSelector from "../../components/herds/DinoSelector";

type HerdWithIncludes =
  | HerdType & {
      dinos: (Dino & {
        attributes: Attributes | null;
      })[];
      isBroken?: boolean;
    };

// Custom hook to filter and sort herds
function filterHerds(
  allHerds: HerdWithIncludes[] | undefined,
  color: string | null,
  skin: string | null,
  background: string | null,
  tier: string | null,
  belly: string | null,
  pattern: string | null,
  qualifier: string | null,
  showMyHerds: boolean
): HerdWithIncludes[] {
  if (!allHerds) return [];

  // Define tier order for sorting
  const tierOrder = {
    PERFECT: 0,
    FLAWLESS: 1,
    IMPRESSIVE: 2,
    BASIC: 3,
  };

  // Filter herds
  const filtered = allHerds.filter((herd) => {
    // Filter out broken herds only when not showing "My Herds"
    if (!showMyHerds && herd.isBroken) return false;

    // Only filter out herds with no matches when not showing "My Herds"
    if (!showMyHerds && !herd.matches) return false;

    // Filter by tier - use schema's tier field directly
    if (tier && tier !== "all") {
      if (herd.tier.toLowerCase() !== tier.toLowerCase()) return false;
    }

    // Filter by qualifier - using schema's qualifier field
    if (qualifier && qualifier !== "all") {
      if (herd.qualifier?.toLowerCase() !== qualifier.toLowerCase()) {
        return false;
      }
    }

    // Filter by matching traits
    if (skin && skin !== "all") {
      if (!herd.matches.toLowerCase().includes(`skin:${skin.toLowerCase()}`)) {
        return false;
      }
    }

    if (color && color !== "all") {
      if (
        !herd.matches.toLowerCase().includes(`color:${color.toLowerCase()}`)
      ) {
        return false;
      }
    }

    if (background && background !== "all") {
      if (
        !herd.matches
          .toLowerCase()
          .includes(`background:${background.toLowerCase()}`)
      ) {
        return false;
      }
    }

    if (belly && belly !== "all") {
      if (!herd.matches.toLowerCase().includes(`belly`)) {
        return false;
      }
    }

    if (pattern && pattern !== "all") {
      if (!herd.matches.toLowerCase().includes(`pattern`)) {
        return false;
      }
    }

    return true;
  });

  // Sort herds by tier
  return filtered.sort((a, b) => {
    const tierA =
      tierOrder[a.tier.toUpperCase() as keyof typeof tierOrder] ?? 999;
    const tierB =
      tierOrder[b.tier.toUpperCase() as keyof typeof tierOrder] ?? 999;

    // First sort by tier
    if (tierA !== tierB) {
      return tierA - tierB;
    }

    // If tiers are equal, sort by rarity (assuming lower rarity is better)
    return a.rarity - b.rarity;
  });
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

  const color = searchParams.get("color") || "all";
  const skin = searchParams.get("skin") || "all";
  const background = searchParams.get("background") || "all";
  const tier = searchParams.get("tier") || "all";
  // switch 'on' to 'belly' for display purposes
  const belly = searchParams.get("belly") === "on" ? "belly" : "all";
  const pattern = searchParams.get("pattern") === "on" ? "pattern" : "all";
  const qualifier = searchParams.get("qualifier") ?? "all";

  const [showDactyl, setShowDactyl] = useState(true);
  const [showSaga, setShowSaga] = useState(true);
  const [showPFP, setShowPFP] = useState(false);
  const [showMyHerds, setShowMyHerds] = useState(false);
  const [filteredHerds, setFilteredHerds] = useState<HerdWithIncludes[]>([]);
  const [isCreateHerdOpen, setIsCreateHerdOpen] = useState(false);

  const allHerdAddressesSet = new Set(allHerds?.map((herd) => herd.owner));
  const allHerdAddresses = [...allHerdAddressesSet];

  const { data: owners } = useHerdOwners(allHerdAddresses);

  const utils = api.useUtils();
  const createHerdMutation = api.herd.createHerd.useMutation({
    onSuccess: () => {
      utils.herd.getAllHerds.invalidate();
      utils.herd.getUserHerds.invalidate();
      setIsCreateHerdOpen(false);
    },
  });

  useEffect(() => {
    if (allHerds && !allHerdsLoading) {
      let filtered = filterHerds(
        showMyHerds ? myHerds : allHerds,
        color,
        skin,
        background,
        tier,
        belly,
        pattern,
        qualifier,
        showMyHerds
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
    qualifier,
    myHerds,
    pattern,
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
  const filtersActive = [
    color,
    skin,
    background,
    tier,
    belly,
    pattern,
    qualifier,
  ].filter((filter) => filter !== "all").length;
  const filteredResults =
    !allHerdsLoading && filteredHerds && filteredHerds?.length > 0
      ? filteredHerds?.length
      : 0;

  return (
    <>
      <MetaTags
        title="Claynosaurz Herds | Clayno Club"
        description="Who has the finest herd of Claynotopia? Find the most popular Claynosaurz collections."
      />
      <main className="relative flex min-h-screen flex-col items-center  bg-black py-8">
        {allHerdsLoading ? (
          <div className="flex w-full flex-col items-center gap-8 px-4 md:w-[90%] lg:w-[85%] xl:w-[95%] 2xl:w-[90%]">
            {/* Controls Bar Skeleton */}
            <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-md bg-neutral-800" />
                <Skeleton className="h-9 w-24 rounded-md bg-neutral-800" />
                <Skeleton className="h-9 w-24 rounded-md bg-neutral-800" />
                <Skeleton className="h-9 w-32 rounded-md bg-neutral-800" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-28 rounded-md bg-neutral-800" />
                <Skeleton className="h-6 w-24 rounded-md bg-neutral-800" />
                <Skeleton className="h-6 w-24 rounded-md bg-neutral-800" />
              </div>
            </div>

            {/* Herds Grid Skeleton */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-lg bg-neutral-800 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-md bg-neutral-700" />
                    <Skeleton className="h-6 w-20 rounded-md bg-neutral-700" />
                    <Skeleton className="h-6 w-20 rounded-md bg-neutral-700" />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(6)].map((_, j) => (
                      <Skeleton
                        key={j}
                        className="aspect-square rounded-md bg-neutral-700"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32 rounded-md bg-neutral-700" />
                    <Skeleton className="h-8 w-8 rounded-full bg-neutral-700" />
                  </div>
                </div>
              ))}
            </div>
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

            <section className="flex flex-col items-center gap-4 text-white md:w-[90%] lg:w-[85%] xl:w-[95%] 2xl:w-[90%]">
              {/* Main Controls Bar */}
              <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Left Side Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
                        <HiInformationCircle size={20} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="border-none bg-neutral-900/95 backdrop-blur-md">
                      <DialogHeader className="relative">
                        <DialogTitle className="font-clayno text-3xl tracking-wide text-white">
                          Understanding{" "}
                          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            Herds
                          </span>
                        </DialogTitle>
                        <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-neutral-100">
                          <HiX className="h-6 w-6 text-neutral-300" />
                          <span className="sr-only">Close</span>
                        </DialogClose>
                      </DialogHeader>
                      <DialogDescription className="text-neutral-200">
                        <div className="space-y-4 pt-2">
                          {/* Basic Description */}
                          <div>
                            <p className="mb-4 leading-relaxed text-neutral-200">
                              A herd is defined as one of each original
                              Claynosaurz species:{" "}
                              <span className="font-clayno tracking-wide text-neutral-300">
                                Rex, Raptor, Trice, Bronto, Stego,
                              </span>{" "}
                              and{" "}
                              <span className="font-clayno tracking-wide text-neutral-300">
                                Ankylo
                              </span>
                              .
                            </p>
                            <p>
                              Herds are ranked by how many matching traits they
                              share, with additional bonuses for owning matching
                              Sagas (
                              <span className="font-clayno tracking-wide text-neutral-300">
                                Spino
                              </span>{" "}
                              and{" "}
                              <span className="font-clayno tracking-wide text-neutral-300">
                                Para
                              </span>{" "}
                              ) or{" "}
                              <span className="font-clayno tracking-wide text-neutral-300">
                                Dactyl.
                              </span>
                            </p>
                          </div>

                          {/* Base Herds */}
                          <div>
                            <h3 className="mb-3 font-clayno text-xl tracking-wide text-white">
                              Base Herds:
                            </h3>
                            <p className="mb-2 text-neutral-300">
                              There are three core traits: Skin, Color, and
                              Background
                            </p>
                            <ul className="list-inside space-y-1 pl-4">
                              <li>
                                <span className="font-semibold">Basic</span>:
                                Matching Skin OR Color
                              </li>
                              <li>
                                <span className="font-semibold">
                                  Impressive
                                </span>
                                : Any 2 matching core traits
                              </li>
                              <li>
                                <span className="font-semibold">Flawless</span>:
                                All 3 core traits matching
                              </li>
                              <li>
                                <span className="font-semibold">Perfect</span>:
                                All core traits matching, plus either Belly ON
                                or Pattern ON
                              </li>
                            </ul>
                          </div>

                          {/* Qualifiers */}
                          <div>
                            <h3 className="mb-3 font-clayno text-xl tracking-wide text-white">
                              Herd Qualifiers:
                            </h3>
                            <ul className="list-inside list-disc space-y-1 pl-4">
                              <li>
                                <span className="font-semibold">Mighty</span>:
                                if you own 2 Sagas{" "}
                                <span className="text-yellow-400">OR</span> 1
                                Dactyl
                              </li>
                              <li>
                                <span className="font-semibold">Legendary</span>
                                : if you own 2 Sagas{" "}
                                <span className="text-yellow-400">AND</span> 1
                                Dactyl
                              </li>
                            </ul>
                          </div>

                          {/* Example */}
                          <div className="mt-2 rounded-lg bg-neutral-800/50 p-6">
                            <p className="mb-2 font-clayno text-sm text-neutral-300">
                              Example
                            </p>
                            <p className="text-sm">
                              A{" "}
                              <span className="font-clayno text-lg tracking-wide text-yellow-400">
                                Mighty Flawless Herd
                              </span>{" "}
                              would have:
                            </p>
                            <ul className="mt-1 list-inside list-disc space-y-1 pl-4 text-sm text-neutral-300">
                              <li>
                                One of each OG species with matching Skin,
                                Color, and Background
                              </li>
                              <li>Plus either 2 Sagas or 1 Dactyl</li>
                            </ul>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  <FilterDialog
                    color={color}
                    skin={skin}
                    background={background}
                    tier={tier}
                    belly={belly}
                    pattern={pattern}
                    qualifier={qualifier}
                    className="flex items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                  />
                  {filtersActive > 0 && (
                    <Link
                      href="?"
                      className="flex items-center gap-2 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Clear [{filtersActive}]
                      <HiX size={20} />
                    </Link>
                  )}
                  {user && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowMyHerds(!showMyHerds)}
                        className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                          showMyHerds
                            ? "bg-blue-500 text-white"
                            : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        My Herds
                      </button>
                    </div>
                  )}
                  <div className="text-sm font-medium">
                    {filteredResults} herds
                  </div>
                  <div className="text-xs italic text-zinc-500">
                    Updated {lastUpdated}
                  </div>
                </div>

                {/* Right Side Toggles */}
                <div className="flex items-center gap-4">
                  <ToggleSwitch
                    checked={showDactyl}
                    onChange={setShowDactyl}
                    label="Show Dactyl"
                    activeColor="bg-blue-500"
                  />
                  <ToggleSwitch
                    checked={showSaga}
                    onChange={setShowSaga}
                    label="Show Saga"
                    activeColor="bg-blue-500"
                  />
                  <ToggleSwitch
                    checked={showPFP}
                    onChange={setShowPFP}
                    label="Show PFP"
                    activeColor="bg-blue-500"
                  />
                </div>
              </div>
            </section>

            <section className="w-full md:w-[90%] lg:w-[85%] xl:w-[95%] 2xl:w-[90%]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {filteredResults === 0 && !showMyHerds && (
                  <div className="mt-10 flex flex-col items-center justify-center gap-2 md:col-span-2 xl:col-span-3">
                    {allHerdsLoading ? (
                      <HiRefresh
                        size={50}
                        className="animate-spin text-white"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-neutral-300">
                        No herds found matching these filters
                      </p>
                    )}
                  </div>
                )}

                {filteredHerds?.map((herd) => {
                  const foundUser = owners?.find((user) => {
                    return user.wallets.some(
                      (wallet) => wallet.address === herd.owner
                    );
                  });
                  return (
                    <motion.div
                      key={herd.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="group flex flex-col items-center"
                    >
                      <div className="w-full transform transition-all duration-200 ease-out hover:scale-[1.02]">
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
                    </motion.div>
                  );
                })}

                {/* Add Create Herd Card */}
                {showMyHerds && user && (
                  <Dialog
                    open={isCreateHerdOpen}
                    onOpenChange={setIsCreateHerdOpen}
                  >
                    <DialogTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="group flex flex-col items-center"
                      >
                        <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-800/50 p-8 transition-all duration-200 ease-out hover:border-blue-500 hover:bg-neutral-800">
                          <Plus className="mb-2 h-12 w-12 text-neutral-400" />
                          <span className="text-center font-clayno text-lg text-neutral-400">
                            Create New Herd
                          </span>
                          <span className="mt-2 text-center text-sm text-neutral-500">
                            Click to build a new herd from your collection
                          </span>
                        </div>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="gap-0 border-neutral-700 bg-neutral-900 p-4 font-clayno text-white">
                      <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle>Create New Herd</DialogTitle>
                      </DialogHeader>
                      <div className="flex max-h-[80vh] flex-col gap-4 py-2">
                        <DinoSelector
                          owner={user.wallets[0]?.address}
                          currentHerd={[]}
                          onSelectionChange={(mints) => {
                            if (mints.length > 0) {
                              createHerdMutation.mutate({
                                owner: user.wallets[0]?.address ?? "",
                                dinoMints: mints,
                              });
                            }
                          }}
                          wallets={user.wallets}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </motion.div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
