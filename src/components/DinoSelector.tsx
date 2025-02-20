import Image from "next/image";
import { api } from "~/utils/api";
import type { Wallet, Dino, Attributes } from "@prisma/client";
import { useState } from "react";

type DinoSelectorProps = {
  owner: string;
  currentHerd: (Dino & { attributes: Attributes | null })[];
  onSelectionChange: (dinos: string[]) => void;
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

export default function DinoSelector({
  owner,
  currentHerd,
  onSelectionChange,
  wallets,
}: DinoSelectorProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(
    null
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
    console.log("selectedSpecies", selectedSpecies);
    if (!selectedSpecies) return;
    setSelectedReplacement(newDino.mint);
    console.log("newDino", newDino);
    const newMints = currentHerd.map((dino) =>
      dino.attributes?.species === selectedSpecies ? newDino.mint : dino.mint
    );
    onSelectionChange(newMints);
  };

  return (
    <div className="flex h-full max-h-[90vh] flex-col gap-2 overflow-hidden bg-neutral-900 text-white">
      {/* Current Herd Display */}
      <div className="grid grid-cols-3 gap-2">
        {currentHerd.map((dino) => {
          const replacementDino =
            selectedSpecies === dino.attributes?.species && selectedReplacement
              ? dinosBySpecies[selectedSpecies]?.find(
                  (d) => d.mint === selectedReplacement
                )
              : dino;

          return (
            <div
              key={dino.mint}
              onClick={() =>
                setSelectedSpecies(dino.attributes?.species ?? null)
              }
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-neutral-800 p-1.5 ${
                selectedSpecies === dino.attributes?.species
                  ? "border-blue-500"
                  : "border-neutral-700 hover:border-neutral-600"
              }`}
            >
              <div className="relative aspect-square w-full">
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

        {/* Add slots for missing optional species */}
        {OPTIONAL_SPECIES.map((species) => {
          const hasSpecies = currentHerd.some(
            (dino) => dino.attributes?.species === species
          );

          if (!hasSpecies) {
            const replacementDino =
              selectedSpecies === species && selectedReplacement
                ? dinosBySpecies[species]?.find(
                    (d) => d.mint === selectedReplacement
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
