import Image from "next/image";
import { api } from "~/utils/api";
import type { Wallet, Dino, Attributes } from "@prisma/client";
import { useState } from "react";
import { Plus } from "lucide-react";

type DinoSelectorProps = {
  owner: string;
  currentHerd: (Dino & { attributes: Attributes | null })[];
  onSelectionChange: (mints: string[]) => void;
  wallets: Wallet[];
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

const SPECIES_DISPLAY_NAMES: Record<string, string> = {
  Dactyl: "Dactyl",
  Spino: "Spino",
  Para: "Para",
};

const hasAllCoreSpecies = (selectedDinos: Record<string, string>) => {
  return REQUIRED_SPECIES.every((species) => selectedDinos[species]);
};

export default function DinoSelector({
  owner,
  currentHerd,
  onSelectionChange,
  wallets,
}: DinoSelectorProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [displayedHerd, setDisplayedHerd] = useState(currentHerd);
  const [selectedDinos, setSelectedDinos] = useState<Record<string, string>>(
    currentHerd.reduce((acc, dino) => {
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

  const handleDinoSwap = (newDino: (typeof allDinos)[0]) => {
    if (!selectedSpecies || !newDino.attributes?.species) return;

    // Update the selected dinos for this species
    const updatedSelections = {
      ...selectedDinos,
      [selectedSpecies]: newDino.mint,
    };
    setSelectedDinos(updatedSelections);

    // Find the existing dino with this species in the displayed herd
    const existingDinoIndex = displayedHerd.findIndex(
      (dino) => dino.attributes?.species === selectedSpecies
    );

    // Update displayedHerd state
    if (existingDinoIndex !== -1) {
      // Replace existing dino
      const updatedHerd = [...displayedHerd];
      updatedHerd[existingDinoIndex] = newDino;
      setDisplayedHerd(updatedHerd);
    } else {
      // Add new dino
      setDisplayedHerd([...displayedHerd, newDino]);
    }

    // Convert selections back to array of mints for the parent component
    const newMints = Object.values(updatedSelections);
    onSelectionChange(newMints);
  };

  const handleDinoRemove = (speciesName: string) => {
    // Prevent removing required species
    if (REQUIRED_SPECIES.includes(speciesName)) {
      return;
    }

    // Update the selected dinos
    const updatedSelections = { ...selectedDinos };
    delete updatedSelections[speciesName];
    setSelectedDinos(updatedSelections);

    // Update the displayed herd immediately
    const remainingDinos = displayedHerd.filter(
      (dino) => dino.attributes?.species !== speciesName
    );
    setDisplayedHerd(remainingDinos);

    // Update parent component
    const newMints = remainingDinos.map((dino) => dino.mint);
    onSelectionChange(newMints);

    // Reset selected species if we just removed it
    if (selectedSpecies === speciesName) {
      setSelectedSpecies(null);
    }
  };

  const getMissingCoreSpecies = () => {
    const presentSpecies = new Set(
      displayedHerd
        .map((dino) => dino.attributes?.species)
        .filter((species): species is string => !!species)
    );

    return REQUIRED_SPECIES.filter((species) => !presentSpecies.has(species));
  };

  return (
    <div className="flex h-full max-h-[90vh] flex-col gap-2 overflow-hidden bg-neutral-900 text-white">
      {/* Current Herd Display */}
      <div className="grid grid-cols-3 gap-2">
        {displayedHerd.map((dino) => {
          const species = dino.attributes?.species;
          const replacementDino =
            species && selectedDinos[species]
              ? dinosBySpecies[species]?.find(
                  (d) => d.mint === selectedDinos[species]
                )
              : dino;

          return (
            <div
              key={dino.mint}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-neutral-800 p-1.5 ${
                selectedSpecies === species
                  ? "border-blue-500"
                  : "border-neutral-700 hover:border-neutral-600"
              }`}
            >
              {/* Add remove button */}
              {species && !REQUIRED_SPECIES.includes(species) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDinoRemove(species);
                  }}
                  className="absolute right-1 top-1 z-10 rounded-full bg-red-500 p-1 text-white opacity-0 hover:bg-red-600 group-hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                onClick={() => setSelectedSpecies(species ?? null)}
                className="relative aspect-square w-full"
              >
                <Image
                  src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                    replacementDino?.gif ?? dino.gif
                  }`}
                  alt={replacementDino?.name ?? dino.name}
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
              <div className="mt-1 text-center font-clayno text-xs text-neutral-300">
                {replacementDino?.attributes?.species ??
                  dino.attributes?.species}
              </div>
            </div>
          );
        })}

        {/* Add missing core species buttons */}
        {getMissingCoreSpecies().map((species) => (
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
              <Plus className="h-6 w-6 text-neutral-500" />
            </div>
            <div className="mt-1 text-center font-clayno text-xs text-neutral-300">
              Add {species}
            </div>
          </div>
        ))}

        {/* Keep existing optional species slots */}
        {OPTIONAL_SPECIES.map((species) => {
          const hasSpecies = displayedHerd.some(
            (dino) => dino.attributes?.species === species
          );

          if (!hasSpecies) {
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
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600">
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
                  {/* <div className="mt-1 text-center text-xs text-neutral-300">
                    {dino.name}
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
