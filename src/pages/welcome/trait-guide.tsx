"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Dices } from "lucide-react";
import { Button } from "~/@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/@/components/ui/tabs";
import { api } from "~/utils/api";
import { cn } from "~/@/lib/utils";
import { useImageViewer } from "~/hooks/useImageViewer";
import ImageViewer from "~/components/ImageViewer";

const SPECIES_CLASSES = {
  Rex: ["Warrior", "Mystic", "Stalker"],
  Trice: ["Warrior", "Defender", "Tracker"],
  Stego: ["Defender", "Mender", "Mystic"],
  Ankylo: ["Defender", "Warrior", "Mender"],
  Bronto: ["Mender", "Mystic", "Defender"],
  Raptor: ["Tracker", "Stalker", "Warrior"],
  Spino: [],
  Para: [],
  Dactyl: [],
} as const;

interface BaseTrait {
  name: string;
  rarity: number;
  species?: string[];
  speciesNote?: string;
}

type Trait = BaseTrait;

type TraitCategory = keyof typeof TRAITS;

type TraitsType = {
  SPECIES: BaseTrait[];
  SKIN: BaseTrait[];
  MOOD: BaseTrait[];
  COLOR: BaseTrait[];
  MOTION: BaseTrait[];
  BACKGROUND: BaseTrait[];
  LAYERS: BaseTrait[];
  CLASS: BaseTrait[];
};

const TRAITS: TraitsType = {
  SPECIES: [
    { name: "Rex", rarity: 17.47 },
    { name: "Trice", rarity: 15.54 },
    { name: "Stego", rarity: 13.79 },
    { name: "Ankylo", rarity: 13.2 },
    { name: "Bronto", rarity: 11.45 },
    { name: "Raptor", rarity: 10.24 },
    { name: "Spino", rarity: 8.18 },
    { name: "Para", rarity: 8.18 },
    { name: "Dactyl", rarity: 1.78 },
  ],
  SKIN: [
    {
      name: "Mirage",
      rarity: 20.17,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Amazonia",
      rarity: 13.39,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Jurassic",
      rarity: 12.96,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
        "Dactyl",
      ],
    },
    {
      name: "Savanna",
      rarity: 11.34,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Cristalline",
      rarity: 8.79,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Coral",
      rarity: 8.36,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
        "Dactyl",
      ],
    },
    {
      name: "Oceania",
      rarity: 8.0,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Elektra",
      rarity: 7.72,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Toxic",
      rarity: 6.09,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
        "Dactyl",
      ],
    },
    {
      name: "Apres",
      rarity: 2.97,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
        "Dactyl",
      ],
    },
  ],
  MOOD: [
    { name: "Confident", rarity: 12.95 },
    { name: "Sad", rarity: 12.73 },
    { name: "Excited", rarity: 12.6 },
    { name: "Bored", rarity: 12.56 },
    { name: "Scared", rarity: 12.45 },
    { name: "Happy", rarity: 12.29 },
    { name: "Sleepy", rarity: 12.19 },
    { name: "Smug", rarity: 12.12 },
  ],
  COLOR: [
    { name: "Volcanic", rarity: 19.53 },
    { name: "Desert", rarity: 18.7 },
    { name: "Tropic", rarity: 17.21 },
    { name: "Aqua", rarity: 17.01 },
    { name: "Spring", rarity: 9.97 },
    { name: "Amethyst", rarity: 8.57 },
    { name: "Charcoal", rarity: 4.9 },
    { name: "Mist", rarity: 3.89 },
  ],
  MOTION: [
    {
      name: "Slow Walk",
      rarity: 19.75,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Walk",
      rarity: 19.73,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Trot",
      rarity: 19.74,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Idle",
      rarity: 19.52,
      species: [
        "Rex",
        "Trice",
        "Stego",
        "Ankylo",
        "Bronto",
        "Raptor",
        "Spino",
        "Para",
      ],
    },
    {
      name: "Gallop",
      rarity: 10.54,
      species: ["Trice", "Stego", "Ankylo", "Bronto"],
    },
    {
      name: "Run",
      rarity: 8.72,
      species: ["Rex", "Raptor", "Spino", "Para"],
    },
    { name: "Flap", rarity: 0.61, species: ["Dactyl"] },
    { name: "Glide", rarity: 0.41, species: ["Dactyl"] },
    { name: "Fly", rarity: 0.38, species: ["Dactyl"] },
    { name: "Soar", rarity: 0.38, species: ["Dactyl"] },
  ],
  BACKGROUND: [
    { name: "Lavender", rarity: 7.34 },
    { name: "Mint", rarity: 8.56 },
    { name: "Peach", rarity: 6.78 },
    { name: "Sky", rarity: 9.23 },
    { name: "Salmon", rarity: 5.67 },
    { name: "Dune", rarity: 7.89 },
  ],
  LAYERS: [
    { name: "1", rarity: 37.45 },
    { name: "2", rarity: 32.82 },
    { name: "3", rarity: 24.01 },
    { name: "4", rarity: 3.51 },
    { name: "0", rarity: 2.0 },
  ],
  CLASS: [
    {
      name: "Warrior",
      rarity: 8.12,
      species: ["Rex", "Trice", "Ankylo"],
      speciesNote: "One of three possible classes for each species",
    },
    {
      name: "Mystic",
      rarity: 6.74,
      species: ["Trice", "Stego", "Bronto"],
      speciesNote: "One of three possible classes for each species",
    },
    {
      name: "Tracker",
      rarity: 7.93,
      species: ["Trice", "Raptor", "Bronto"],
      speciesNote: "One of three possible classes for each species",
    },
    {
      name: "Mender",
      rarity: 5.86,
      species: ["Bronto", "Stego", "Raptor"],
      speciesNote: "One of three possible classes for each species",
    },
    {
      name: "Stalker",
      rarity: 9.21,
      species: ["Rex", "Raptor", "Ankylo"],
      speciesNote: "One of three possible classes for each species",
    },
    {
      name: "Defender",
      rarity: 7.45,
      species: ["Rex", "Stego", "Ankylo"],
      speciesNote: "One of three possible classes for each species",
    },
  ],
};

const COLLECTIONS = {
  GENESIS: {
    name: "Genesis",
    description:
      "10,222 characters comprising of 7 unique species (Ankylo, Bronto, Dactyl, Raptor, Rex, Stego, Trice) released in November 2022.",
    species: ["Ankylo", "Bronto", "Dactyl", "Raptor", "Rex", "Stego", "Trice"],
  },
  SAGA: {
    name: "The Call of Saga",
    description:
      "The Expansion Collection. 2,000 characters comprising of 2 unique species (Para & Spino) released in partnership with Solana Mobile in 2023.",
    species: ["Para", "Spino"],
  },
};

interface RandomDino extends BaseTrait {
  gif?: string;
  classPFP?: string;
}

type RandomDinosState = { [key in TraitCategory]?: RandomDino[] };

export default function TraitGuide() {
  const [selectedCategory, setSelectedCategory] =
    useState<TraitCategory>("SPECIES");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("Rex");
  const [randomDinos, setRandomDinos] = useState<RandomDinosState>({});
  const { selectedImage, isOpen, openImage, closeImage } = useImageViewer();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const species = TRAITS.SPECIES.map((s) => s.name);
  const traits = TRAITS[selectedCategory].map((t) => t.name);

  const getRandomDinosByTrait = api.trait.getRandomDinosByTrait.useQuery({
    species: selectedSpecies,
    attributeName:
      selectedCategory === "LAYERS"
        ? "layerCount"
        : selectedCategory.toLowerCase(),
    traits: traits,
  });

  const fetchRandomDinos = useCallback(
    async (category: TraitCategory) => {
      if (randomDinos[category]) return;

      const result = await getRandomDinosByTrait.refetch({});

      if (result.data) {
        setRandomDinos((prev) => ({ ...prev, [category]: result.data }));
      }
    },
    [getRandomDinosByTrait, randomDinos]
  );

  const refreshDinos = useCallback(() => {
    setRandomDinos({});
    if (selectedCategory !== "SPECIES") {
      const randomSpecies =
        species[Math.floor(Math.random() * species.length)]!;
      setSelectedSpecies(randomSpecies);
    }
    fetchRandomDinos(selectedCategory);
  }, [selectedCategory, fetchRandomDinos, species]);

  useEffect(() => {
    fetchRandomDinos(selectedCategory);
  }, [selectedCategory, fetchRandomDinos]);

  useEffect(() => {
    // Remove the first load state after 5 seconds
    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Filter traits based on selected species and category
  const getFilteredTraits = (category: TraitCategory, traits: Trait[]) => {
    // Handle species tab
    if (category === "SPECIES") return traits;

    // Handle class tab
    if (category === "CLASS") {
      const availableClasses = traits.filter((trait) => {
        if ("species" in trait && trait.species) {
          return trait.species.includes(selectedSpecies);
        }
        return false;
      });

      if (availableClasses.length === 0) {
        return [
          {
            name: "Coming Soon",
            rarity: 0,
            species: [selectedSpecies],
            speciesNote: "Classes for this species are not yet available",
          },
        ];
      }
      return availableClasses;
    }

    // Handle motion and skin tabs
    if (category === "MOTION" || category === "SKIN") {
      return traits.filter((trait) => {
        if ("species" in trait && trait.species) {
          return trait.species.includes(selectedSpecies);
        }
        return true;
      });
    }

    // Return unfiltered traits for other categories
    return traits;
  };

  return (
    <div className="rounded-2xl bg-black px-1 py-2 text-neutral-200 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Tabs
          defaultValue="SPECIES"
          onValueChange={(value) => setSelectedCategory(value as TraitCategory)}
          className="space-y-2 sm:space-y-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="flex w-full flex-wrap gap-1 rounded-md bg-neutral-900 p-1 sm:w-auto sm:gap-2">
              {Object.keys(TRAITS).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex-1 rounded-sm px-2 py-1 text-[10px] font-medium text-neutral-300 ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm sm:flex-none sm:px-3 sm:py-1.5 sm:text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center gap-2 rounded-md bg-neutral-800/50 px-2 py-1 text-[10px] text-neutral-300 backdrop-blur-sm sm:text-sm">
                <span className="text-neutral-500">Species:</span>
                <span className="font-medium text-neutral-200">{selectedSpecies}</span>
              </div>
              <Button
                onClick={refreshDinos}
                variant="default"
                size="icon"
                className={cn(
                  "relative h-7 w-7 bg-purple-500/10 p-1 text-purple-400 transition-all hover:bg-purple-500/20 hover:text-purple-300 sm:h-8 sm:w-8 sm:p-1.5",
                  isFirstLoad && [
                    "animate-spin-bounce",
                    "after:absolute after:inset-0 after:z-[-1] after:animate-pulse-glow after:rounded-md after:bg-purple-400/20",
                    "before:absolute before:inset-0 before:z-[-1] before:animate-pulse-glow before:rounded-md before:bg-purple-400/20 before:blur-sm",
                  ]
                )}
              >
                <Dices className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {Object.entries(TRAITS).map(([category, traits]) => (
            <TabsContent key={category} value={category} className="mt-2 sm:mt-6">
              <div className="grid grid-cols-2 gap-1.5 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                {getFilteredTraits(category as TraitCategory, traits).map(
                  (trait: Trait, index) => {
                    const { name, rarity } = trait;
                    const allowedSpecies =
                      "species" in trait ? trait.species : undefined;
                    const speciesNote =
                      "speciesNote" in trait ? trait.speciesNote : undefined;

                    return (
                      <Card
                        key={name}
                        className="overflow-hidden border-neutral-800 bg-neutral-900"
                      >
                        <CardHeader className="p-0">
                          <div className="relative aspect-square w-full cursor-pointer overflow-hidden">
                            {(
                              randomDinos[category as TraitCategory]?.[
                                index
                              ] as RandomDino | undefined
                            )?.gif ||
                            (category === "CLASS" &&
                              (
                                randomDinos[category as TraitCategory]?.[
                                  index
                                ] as RandomDino | undefined
                              )?.classPFP) ? (
                              <div
                                className="relative h-full w-full"
                                onClick={() => {
                                  const imageUrl =
                                    category === "CLASS"
                                      ? (
                                          randomDinos[
                                            category as TraitCategory
                                          ]?.[index] as RandomDino | undefined
                                        )?.classPFP?.replace(".gif", ".png")
                                      : (
                                          randomDinos[
                                            category as TraitCategory
                                          ]?.[index] as RandomDino | undefined
                                        )?.gif;
                                  if (imageUrl) {
                                    openImage(imageUrl);
                                  }
                                }}
                              >
                                <Image
                                  src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                                    category === "CLASS"
                                      ? (
                                          randomDinos[
                                            category as TraitCategory
                                          ]?.[index] as RandomDino | undefined
                                        )?.classPFP?.replace(".gif", ".png") ??
                                        ""
                                      : (
                                          randomDinos[
                                            category as TraitCategory
                                          ]?.[index] as RandomDino | undefined
                                        )?.gif ?? ""
                                  }`}
                                  alt={`${category} - ${name}`}
                                  fill
                                  className="object-cover transition-transform hover:scale-105"
                                />
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                                <div className="flex flex-col items-center gap-4">
                                  <div className="h-16 w-16 animate-pulse rounded-lg bg-neutral-700 sm:h-24 sm:w-24">
                                    <div className="h-full w-full bg-gradient-to-br from-neutral-600 to-neutral-700 opacity-50" />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="h-2 w-24 animate-pulse rounded-md bg-neutral-700 sm:h-3 sm:w-32" />
                                    <div className="h-2 w-16 animate-pulse rounded-md bg-neutral-700 sm:h-3 sm:w-24" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-1.5 sm:p-4">
                          <CardTitle className="mb-1 text-sm text-neutral-100 sm:mb-2 sm:text-lg">
                            {name}
                            {category === "SPECIES" && (
                              <span
                                className={`ml-1 text-[10px] font-medium sm:ml-2 sm:text-xs ${
                                  COLLECTIONS.SAGA.species.includes(name)
                                    ? "text-yellow-400"
                                    : "text-blue-400"
                                }`}
                              >
                                {COLLECTIONS.SAGA.species.includes(name)
                                  ? "Saga"
                                  : "Genesis"}
                              </span>
                            )}
                            {allowedSpecies &&
                              selectedCategory === "SPECIES" && (
                                <div className="mt-0.5 text-[10px] text-neutral-400 sm:mt-1 sm:text-xs">
                                  {allowedSpecies.length === 1
                                    ? `${allowedSpecies[0]} only`
                                    : `Available for ${allowedSpecies.length} species`}
                                  {speciesNote && (
                                    <div className="mt-0.5 text-neutral-500">
                                      {speciesNote}
                                    </div>
                                  )}
                                </div>
                              )}
                          </CardTitle>
                          <div className="mb-1 flex items-center justify-between text-[10px] sm:text-xs">
                            <span className="text-neutral-400">Rarity</span>
                            <span
                              className={cn(
                                rarity <= 1
                                  ? "text-red-500"
                                  : rarity <= 5
                                  ? "text-orange-500"
                                  : rarity <= 10
                                  ? "text-yellow-500"
                                  : rarity <= 15
                                  ? "text-blue-500"
                                  : "text-green-500"
                              )}
                            >
                              {rarity.toFixed(2)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-700 sm:h-2">
                            <div
                              className={cn(
                                "h-full",
                                rarity <= 1
                                  ? "bg-red-500"
                                  : rarity <= 5
                                  ? "bg-orange-500"
                                  : rarity <= 10
                                  ? "bg-yellow-500"
                                  : rarity <= 15
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              )}
                              style={{ width: `${Math.min(rarity * 2, 100)}%` }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <ImageViewer
        isOpen={isOpen}
        imageUrl={selectedImage || ""}
        onClose={closeImage}
      />
    </div>
  );
}
