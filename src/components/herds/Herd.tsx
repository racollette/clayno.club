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
import { analyzeHerd } from "~/utils/analyzeHerd";
import ConfirmDialog from "./ConfirmDialog";
import { AlertTriangle } from "lucide-react";

type HerdProps = {
  herd: Herd & {
    dinos: (Dino & {
      attributes: Attributes | null;
    })[];
    isBroken?: boolean;
    dinoOrder?: string;
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

const CORE_SPECIES = [
  "Rex",
  "Bronto",
  "Raptor",
  "Ankylo",
  "Stego",
  "Trice",
] as const;

const sortDinosByOrder = (
  dinos: (Dino & { attributes: Attributes | null })[],
  dinoOrder?: string
) => {
  if (!dinoOrder) return dinos;

  const orderArray = dinoOrder.split(",");
  const dinoMap = new Map(dinos.map((dino) => [dino.mint, dino]));

  return orderArray
    .map((mint) => dinoMap.get(mint))
    .filter((dino): dino is Dino & { attributes: Attributes | null } => !!dino);
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
      utils.herd.getHerd.invalidate({ id: herd.id });
      setIsDialogOpen(false);
    },
  });

  const deleteHerdMutation = api.herd.deleteHerd.useMutation({
    onSuccess: () => {
      utils.herd.getAllHerds.invalidate();
      utils.herd.getUserHerds.invalidate();
    },
  });

  const { username, userHandle, userPFP, favoriteDomain } =
    extractProfileFromUser(owner);

  const isHerdOwner = currentUser?.wallets.some(
    (wallet) => wallet.address === herd.owner
  );

  useEffect(() => {
    let filteredDinos = herd.dinos;

    console.log("Herd - Initial dinos:", {
      order: herd.dinoOrder,
      species: herd.dinos.map((d) => ({
        species: d.attributes?.species,
        mint: d.mint,
        position: herd.dinos.indexOf(d),
      })),
    });

    if (!showDactyl && !showSaga) {
      filteredDinos = filteredDinos.filter(
        (dino) =>
          dino.attributes?.species !== "Para" &&
          dino.attributes?.species !== "Spino" &&
          dino.attributes?.species !== "Dactyl"
      );
    } else if (!showDactyl) {
      filteredDinos = filteredDinos.filter(
        (dino) => dino.attributes?.species !== "Dactyl"
      );
    } else if (!showSaga) {
      filteredDinos = filteredDinos.filter(
        (dino) =>
          dino.attributes?.species !== "Para" &&
          dino.attributes?.species !== "Spino"
      );
    }

    // Sort the filtered dinos according to dinoOrder
    const orderedDinos = sortDinosByOrder(filteredDinos, herd.dinoOrder);

    console.log("Herd - After filtering and sorting:", {
      originalOrder: herd.dinoOrder,
      filteredOrder: orderedDinos.map((d) => d.mint).join(","),
      species: orderedDinos.map((d) => ({
        species: d.attributes?.species,
        mint: d.mint,
        position: orderedDinos.indexOf(d),
      })),
    });

    setFilteredHerd({ ...herd, dinos: orderedDinos });
  }, [showDactyl, showSaga, herd]);

  // Add new state for confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingConflicts, setPendingConflicts] = useState<{
    conflicts: Array<{
      herdId: string;
      tier: string;
      qualifier: string | null;
      matches: string;
      affectedDinos: Array<{
        mint: string;
        species: string;
        image: string;
      }>;
    }>;
  } | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSaveEdit = async () => {
    // Check for conflicts
    const conflictCheck = await utils.herd.checkDinoConflicts.fetch({
      herdId: herd.id,
      dinoMints: selectedDinos,
    });

    if (conflictCheck.conflicts.length > 0) {
      setPendingConflicts(conflictCheck);
      setConfirmDialogOpen(true);
      return;
    }

    // Get the dinos data using the tRPC endpoint
    const newDinos = await utils.inventory.getDinosByMints.fetch({
      mints: selectedDinos,
    });

    if (!newDinos) {
      console.error("Failed to fetch dino data");
      return;
    }

    const analysis = analyzeHerd(newDinos);

    // Check if all core species are present
    const presentSpecies = new Set(
      newDinos
        .map((dino) => dino.attributes?.species)
        .filter((species): species is string => !!species)
    );

    const isBroken = CORE_SPECIES.some(
      (species) => !presentSpecies.has(species)
    );

    // Use selectedDinos array directly as the new order
    const newDinoOrder = selectedDinos.join(",");

    updateHerdMutation.mutate({
      herdId: herd.id,
      dinoMints: selectedDinos,
      tier: analysis.tier,
      qualifier: analysis.qualifier,
      matches: analysis.matches,
      rarity: analysis.rarity,
      isEdited: true,
      isBroken,
      dinoOrder: newDinoOrder, // This will now reflect the current display order
    });

    setFilteredHerd({
      ...filteredHerd,
      tier: analysis.tier,
      qualifier: analysis.qualifier,
      matches: analysis.matches,
      rarity: analysis.rarity,
      dinos: newDinos,
      isBroken,
      dinoOrder: newDinoOrder,
    });
  };

  const getMissingCoreSpecies = () => {
    const presentSpecies = new Set(
      filteredHerd.dinos
        .map((dino) => dino.attributes?.species)
        .filter((species): species is string => !!species)
    );

    return CORE_SPECIES.filter((species) => !presentSpecies.has(species));
  };

  const handleDelete = () => {
    if (!herd.id || !herd.owner) return;

    deleteHerdMutation.mutate({
      herdId: herd.id,
      owner: herd.owner,
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="w-full">
      <div
        className={`relative mb-1 flex w-full flex-col rounded-lg border-2 border-neutral-700 bg-neutral-800 p-2  md:p-3 lg:p-4`}
      >
        {filteredHerd.isBroken ? (
          <div className="mb-1 flex items-center gap-1 rounded-md bg-red-900/20 px-2 py-1.5 text-xs text-red-400 md:mb-1.5 md:gap-2 md:px-3 md:py-2 md:text-sm">
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
            This herd is missing core species. Will not be visible in gallery.
          </div>
        ) : (
          (!herd.matches || herd.matches.length === 0) &&
          isHerdOwner && (
            <div className="mb-1 flex items-center gap-1 rounded-md bg-yellow-900/30 px-2 py-1.5 text-xs text-yellow-200 md:mb-1.5 md:gap-2 md:px-3 md:py-2 md:text-sm">
              <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
              <span>No matching traits. Will not be visible in gallery.</span>
            </div>
          )
        )}

        <div
          className={`mb-1 flex flex-none flex-row flex-wrap items-center justify-between gap-1 rounded-md md:gap-2 ${getBorderColor(
            filteredHerd.matches
          )}`}
        >
          {showOwner && (
            <div className="flex items-center">
              {owner?.twitter ||
              owner?.discord ||
              (owner?.telegram && owner?.telegram.isActive) ? (
                <div className="flex flex-row justify-center align-middle">
                  <Link
                    className="flex flex-row rounded-md px-2 py-1 text-white hover:bg-white/20"
                    href={`/inventory/${username}`}
                    target="_blank"
                  >
                    <Image
                      className="mr-1.5 self-center rounded-md md:mr-2"
                      src={userPFP ?? ""}
                      alt="Avatar"
                      width={24}
                      height={24}
                      onError={handleUserPFPDoesNotExist}
                    />
                    <div className="text-sm font-bold text-white md:text-base">
                      {username}
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-row gap-1.5 align-middle md:gap-2">
                  <Link
                    className="flex flex-row gap-1.5 rounded-md px-1.5 py-1 text-white hover:bg-white/20 md:gap-2 md:px-2 md:py-2"
                    href={`/inventory/${herd.owner}`}
                  >
                    <div className="relative aspect-square self-center">
                      <Image
                        src={`https://ui-avatars.com/api/?name=${herd.owner}&background=random`}
                        alt="Avatar"
                        height={20}
                        width={20}
                        className="rounded-md"
                      />
                    </div>
                    <div className="text-sm font-bold text-white md:text-base">
                      {favoriteDomain
                        ? `${favoriteDomain}.sol`
                        : truncateAccount(herd.owner)}
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            <div className="flex flex-wrap gap-1 md:gap-2">
              {filteredHerd.matches.split("|").map((trait, index) => {
                const [type = "", value] = trait
                  .split(":")
                  .map((t) => t.trim());
                if (!value || value.toLowerCase() === "off") return null;

                const badgeClasses = `rounded-md px-1.5 py-0.5 text-xs font-extrabold text-white md:px-2 md:py-1`;

                if (
                  type.toLowerCase() === "belly" &&
                  value.toLowerCase() === "on"
                ) {
                  return (
                    <div
                      className={`${badgeClasses} ${getTraitBadgeColor(
                        "Belly"
                      )}`}
                      key={index}
                    >
                      Belly
                    </div>
                  );
                }

                if (
                  type.toLowerCase() === "pattern" &&
                  value.toLowerCase() === "on"
                ) {
                  return (
                    <div
                      className={`${badgeClasses} ${getTraitBadgeColor(
                        "Pattern"
                      )}`}
                      key={index}
                    >
                      Pattern
                    </div>
                  );
                }

                return (
                  <div
                    className={`${badgeClasses} ${getTraitBadgeColor(value)}`}
                    key={index}
                  >
                    {value}
                  </div>
                );
              })}
            </div>

            <div
              className={`rounded-md px-1.5 py-0.5 text-xs text-white md:px-2 md:py-1 ${getRarityColor(
                herd.rarity
              )}`}
            >
              {herd.rarity}
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-3 gap-0.5 md:gap-1`} key={herd.id}>
          {(herd.dinoOrder
            ? sortDinosByOrder(filteredHerd.dinos, herd.dinoOrder)
            : filteredHerd.dinos
          ).map((dino) => (
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
          <div className="flex gap-1.5 md:gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-1.5 h-8 border-neutral-700 bg-neutral-800/50 px-2.5 text-xs font-medium text-neutral-300 transition-colors hover:border-white hover:bg-neutral-800 hover:text-white md:mt-2 md:h-9 md:px-3 md:text-sm"
                >
                  Edit Herd
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-auto max-w-[95%] gap-0 rounded-lg border-neutral-700 bg-neutral-900 p-4 font-clayno text-white sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="self-start font-clayno">
                    Edit Herd
                  </DialogTitle>
                </DialogHeader>
                <div className="flex max-h-[80vh] flex-col gap-4 py-2">
                  <DinoSelector
                    currentHerd={herd.dinos}
                    onSelectionChange={setSelectedDinos}
                    wallets={currentUser?.wallets ?? []}
                    herdId={herd.id}
                    updateHerdMutation={updateHerdMutation}
                    filteredHerd={filteredHerd}
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

            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-1.5 h-8 border-red-900/50 bg-neutral-800/50 px-2.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500 hover:bg-neutral-800 hover:text-red-300 md:mt-2 md:h-9 md:px-3 md:text-sm"
                >
                  Delete Herd
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-auto max-w-[95%] rounded-lg border-neutral-700 bg-neutral-900 p-6 text-white sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="self-start font-clayno">
                    Delete Herd
                  </DialogTitle>
                </DialogHeader>
                <div className="py-2">
                  <p className="text-md font-semibold text-neutral-300">
                    Are you sure you want to delete this herd? It can always be
                    recreated.
                  </p>
                  {herd.matches && herd.matches !== "None" && (
                    <div className="mt-4 flex flex-row items-center justify-center gap-3 rounded-md bg-yellow-900/30 p-2 text-sm text-yellow-200">
                      <AlertTriangle className="h-10 w-10" />
                      <p>
                        This herd has matching traits. Deleting it will remove
                        it from the public gallery (until detected again by the
                        algorithm).
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="border-neutral-700 bg-neutral-800 font-clayno text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="bg-red-600 font-clayno text-white hover:bg-red-700 disabled:bg-red-800"
                    disabled={deleteHerdMutation.isLoading}
                  >
                    {deleteHerdMutation.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Deleting...
                      </div>
                    ) : (
                      "Delete Herd"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {pendingConflicts && (
          <ConfirmDialog
            isOpen={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            title="Dino Reassignment"
            message={
              <div className="space-y-4">
                {pendingConflicts.conflicts.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-neutral-700 p-3"
                  >
                    <div className="mb-3 font-medium text-white">
                      Reassigning from a{" "}
                      {[c.qualifier, c.tier].filter(Boolean).join(" ")} herd
                    </div>
                    {c.matches && (
                      <div className="mb-3 grid grid-cols-2 gap-2 rounded-md bg-neutral-800 p-2 text-sm">
                        {c.matches.split("|").map((trait, index) => {
                          const [category, value] = trait.trim().split(":");
                          return (
                            <div key={index}>
                              <div className="text-neutral-400">
                                {(category || "").charAt(0).toUpperCase() +
                                  (category || "").slice(1)}
                              </div>
                              <div className="text-white">{value}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {c.affectedDinos.map((d, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="h-10 w-10 overflow-hidden rounded-md">
                            <Image
                              src={d.image}
                              alt={d.species}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="text-sm">
                            <div className="text-white">{d.species}</div>
                            <div className="text-xs text-neutral-400">
                              {d.mint}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            }
            confirmText="Yes, update all herds"
            cancelText="Cancel"
            onConfirm={() => {
              setConfirmDialogOpen(false);
              handleSaveEdit();
            }}
            onCancel={() => {
              setConfirmDialogOpen(false);
              setPendingConflicts(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
