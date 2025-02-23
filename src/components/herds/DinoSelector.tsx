import Image from "next/image";
import { api } from "~/utils/api";
import type { Wallet, Dino, Attributes } from "@prisma/client";
import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";

type DinoSelectorProps = {
  currentHerd: (Dino & { attributes: Attributes | null })[];
  onSelectionChange: (mints: string[], owner?: string) => void;
  wallets: Wallet[];
  herdId?: string;
  updateHerdMutation?: UseMutationResult<any, any, any>;
  filteredHerd?: any;
};

const REQUIRED_SPECIES = [
  "Rex",
  "Bronto",
  "Raptor",
  "Ankylo",
  "Stego",
  "Trice",
];
const OPTIONAL_SPECIES = ["Dactyl", "Spino", "Para"];

export default function DinoSelector({
  currentHerd,
  onSelectionChange,
  wallets,
  herdId,
  updateHerdMutation,
  filteredHerd,
}: DinoSelectorProps) {
  const sortDinosByOrder = (
    dinos: (Dino & { attributes: Attributes | null })[],
    dinoOrder?: string
  ) => {
    if (!dinoOrder) {
      console.log(
        "DinoSelector - No dinoOrder provided, returning unsorted:",
        dinos.map((d) => ({
          species: d.attributes?.species,
          mint: d.mint,
        }))
      );
      return dinos;
    }

    const orderArray = dinoOrder.split(",");
    const dinoMap = new Map(dinos.map((dino) => [dino.mint, dino]));

    const result = orderArray
      .map((mint) => dinoMap.get(mint))
      .filter(
        (dino): dino is Dino & { attributes: Attributes | null } => !!dino
      );

    return result;
  };

  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  // Initialize displayedHerd with the sorted order from filteredHerd
  const [displayedHerd, setDisplayedHerd] = useState(() => {
    // Use sortDinosByOrder directly with the filteredHerd's dinoOrder
    return sortDinosByOrder(currentHerd ?? [], filteredHerd?.dinoOrder);
  });
  const [pendingChanges, setPendingChanges] = useState(false);

  // Initialize selectedDinos from the sorted displayedHerd
  const [selectedDinos, setSelectedDinos] = useState(() =>
    displayedHerd.reduce((acc, dino) => {
      if (dino.attributes?.species) {
        acc[dino.attributes.species] = dino.mint;
      }
      return acc;
    }, {} as Record<string, string>)
  );

  const { data: userDinos } = api.inventory.getUserItems.useQuery({
    wallets: wallets.map((w) => w.address),
  });

  // Aggregate all dinos from all wallets
  const allDinos =
    userDinos?.reduce((acc, holder) => {
      return acc.concat(holder.mints);
    }, [] as (typeof userDinos)[0]["mints"]) ?? [];

  // Organize user's dinos by species
  const dinosBySpecies = allDinos.reduce((acc, dino) => {
    const species = dino.attributes?.species;
    if (species) {
      if (!acc[species]) acc[species] = [];
      acc[species].push(dino);
    }
    return acc;
  }, {} as Record<string, typeof allDinos>);

  // Add new state to track dino ownership
  const [selectedDinoOwner, setSelectedDinoOwner] = useState<string | null>(
    null
  );

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetDino: (typeof allDinos)[0]
  ) => {
    e.preventDefault();

    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const sourceDino = allDinos.find((d) => d.mint === data.mint);

    if (
      !sourceDino?.attributes ||
      !targetDino?.attributes ||
      !targetDino.attributes.species ||
      !sourceDino.attributes.species
    )
      return;

    // Update the displayed herd with swapped positions
    const updatedHerd = displayedHerd.map((dino) => {
      if (dino.mint === targetDino.mint) return sourceDino;
      if (dino.mint === sourceDino.mint) return targetDino;
      return dino;
    });

    setDisplayedHerd(updatedHerd);
    setPendingChanges(true);

    // Update selected dinos - with type safety
    if (targetDino.attributes?.species && sourceDino.attributes?.species) {
      setSelectedDinos((prev) => ({
        ...prev,
        [targetDino.attributes!.species]: sourceDino.mint,
        [sourceDino.attributes!.species]: targetDino.mint,
      }));

      // Pass the full updated order to the parent
      onSelectionChange(updatedHerd.map((dino) => dino.mint));
    }
  };

  const handleDinoSwap = (newDino: (typeof allDinos)[0]) => {
    if (!selectedSpecies || !newDino.attributes?.species) return;

    // Find the holder that owns this dino
    const owner = userDinos?.find((holder) =>
      holder.mints.some((mint) => mint.mint === newDino.mint)
    )?.owner;

    if (owner) {
      setSelectedDinoOwner(owner);
    }

    // Check if we're replacing an existing dino or adding a new one
    const existingIndex = displayedHerd.findIndex(
      (dino) => dino.attributes?.species === selectedSpecies
    );

    let updatedHerd;
    if (existingIndex !== -1) {
      // Replace existing dino while maintaining order
      updatedHerd = displayedHerd.map((dino, index) =>
        index === existingIndex ? newDino : dino
      );
    } else {
      // Append new dino to the end of the list
      updatedHerd = [...displayedHerd, newDino];
    }

    // Update both state variables
    setDisplayedHerd(updatedHerd);
    setSelectedDinos((prev) => ({
      ...prev,
      [selectedSpecies]: newDino.mint,
    }));

    setPendingChanges(true);

    // Pass the full updated order to the parent
    onSelectionChange(
      updatedHerd.map((dino) => dino.mint),
      owner
    );
  };

  const handleDinoRemove = (speciesName: string) => {
    // Update the selected dinos
    const updatedSelections = { ...selectedDinos };
    delete updatedSelections[speciesName];
    setSelectedDinos(updatedSelections);

    // Update the displayed herd immediately
    const remainingDinos = displayedHerd.filter(
      (dino) => dino.attributes?.species !== speciesName
    );

    // Update the order string to remove the mint
    const newOrder = remainingDinos.map((dino) => dino.mint).join(",");

    // Sort the remaining dinos to maintain visual order
    const sortedDinos = sortDinosByOrder(remainingDinos, newOrder);
    setDisplayedHerd(sortedDinos);

    // Update parent component
    const newMints = sortedDinos.map((dino) => dino.mint);
    onSelectionChange(newMints);

    // Reset selected species if we just removed it
    if (selectedSpecies === speciesName) {
      setSelectedSpecies(null);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLImageElement>,
    dino: (typeof allDinos)[0]
  ) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        mint: dino.mint,
        species: dino.attributes?.species,
        gif: dino.gif,
      })
    );
  };

  return (
    <div className="flex h-full max-h-[90vh] flex-col gap-2 overflow-hidden bg-neutral-900 text-white">
      <div className="grid grid-cols-3 gap-2">
        {/* Show all dinos from displayedHerd first */}
        {displayedHerd.map((dino) => (
          <div
            key={dino.mint}
            className="group relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, dino)}
          >
            {/* Remove button */}
            {dino.attributes?.species && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (dino.attributes?.species) {
                    handleDinoRemove(dino.attributes.species);
                  }
                }}
                className="absolute right-1 top-1 z-10 rounded-full bg-red-500 p-1 text-white opacity-0 hover:bg-red-600 group-hover:opacity-100"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            <div
              onClick={() =>
                setSelectedSpecies(dino.attributes?.species ?? null)
              }
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-neutral-800/50 p-1.5 ${
                selectedSpecies === dino.attributes?.species
                  ? "border-blue-500"
                  : "border-neutral-700 hover:border-neutral-600"
              }`}
            >
              <div className="relative flex aspect-square w-full items-center justify-center">
                <Image
                  src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                  alt={dino.name}
                  fill
                  className="rounded-lg object-contain"
                  draggable
                  onDragStart={(e) => handleDragStart(e, dino)}
                />
              </div>
              <div className="mt-1 text-center font-clayno text-xs text-neutral-300">
                {dino.attributes?.species}
              </div>
            </div>
          </div>
        ))}

        {/* Show empty slots for missing required species */}
        {REQUIRED_SPECIES.map((species) => {
          if (!displayedHerd.some((d) => d.attributes?.species === species)) {
            return (
              <div
                key={species}
                onClick={() => setSelectedSpecies(species)}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/50 p-1.5 hover:border-neutral-600"
              >
                <div className="relative flex aspect-square w-full items-center justify-center">
                  <div className="text-2xl text-neutral-500">+</div>
                </div>
                <div className="mt-1 text-center font-clayno text-xs text-neutral-300">
                  Add {species}
                </div>
              </div>
            );
          }
          return null;
        })}

        {/* Show empty slots for missing optional species */}
        {OPTIONAL_SPECIES.map((species) => {
          if (!displayedHerd.some((d) => d.attributes?.species === species)) {
            const replacementDino =
              selectedSpecies === species && selectedDinos[species]
                ? dinosBySpecies[species]?.find(
                    (d) => d.mint === selectedDinos[species]
                  )
                : null;

            return (
              <div
                key={species}
                onClick={() => setSelectedSpecies(species)}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-neutral-800/50 p-1.5 ${
                  selectedSpecies === species
                    ? "border-blue-500"
                    : "border-neutral-700 hover:border-neutral-600"
                }`}
              >
                <div className="relative flex aspect-square w-full items-center justify-center">
                  {replacementDino ? (
                    <Image
                      src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${replacementDino.gif}`}
                      alt={replacementDino.name}
                      fill
                      className="rounded-lg object-contain"
                    />
                  ) : (
                    <div className="text-2xl text-neutral-500">+</div>
                  )}
                </div>
                <div className="mt-1 text-center font-clayno text-xs text-neutral-300">
                  {replacementDino ? species : `Add ${species}`}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Replacement Options */}
      {selectedSpecies && (
        <div className="flex min-h-0 flex-col gap-2">
          <div className="text-sm text-neutral-300">
            Select replacement {selectedSpecies}:
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-4 gap-2">
              {dinosBySpecies[selectedSpecies]?.map((dino) => (
                <div
                  key={dino.mint}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 p-1.5 hover:border-blue-500"
                  onClick={() => handleDinoSwap(dino)}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`}
                      alt={dino.name}
                      fill
                      className="rounded-lg object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
