"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "~/utils/api"; // Adjust the import based on your project structure
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/@/components/ui/card";
import Image from "next/image";
import { Progress } from "~/@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/@/components/ui/tabs";
import { Button } from "~/@/components/ui/button";
import { RefreshCw } from "lucide-react"; // Import the refresh icon

const TRAITS = {
  SPECIES: [
    { name: "Rex", rarity: 6.89 },
    { name: "Raptor", rarity: 8.25 },
    { name: "Bronto", rarity: 5.47 },
    { name: "Stego", rarity: 7.36 },
    { name: "Ankylo", rarity: 4.78 },
    { name: "Trice", rarity: 6.52 },
    { name: "Dactyl", rarity: 9.14 },
    { name: "Spino", rarity: 5.93 },
    { name: "Para", rarity: 7.81 },
  ],
  SKIN: [
    { name: "Apres", rarity: 5.23 },
    { name: "Toxic", rarity: 7.81 },
    { name: "Elektra", rarity: 4.92 },
    { name: "Amazonia", rarity: 6.15 },
    { name: "Coral", rarity: 8.74 },
    { name: "Jurassic", rarity: 3.56 },
    { name: "Mirage", rarity: 9.37 },
    { name: "Savanna", rarity: 7.02 },
    { name: "Oceania", rarity: 5.68 },
    { name: "Cristalline", rarity: 4.13 },
  ],
  MOOD: [
    { name: "Happy", rarity: 6.32 },
    { name: "Scared", rarity: 8.74 },
    { name: "Bored", rarity: 7.15 },
    { name: "Smug", rarity: 5.93 },
    { name: "Confident", rarity: 9.46 },
    { name: "Sad", rarity: 4.87 },
    { name: "Excited", rarity: 8.29 },
    { name: "Sleepy", rarity: 6.78 },
  ],
  COLOR: [
    { name: "Spring", rarity: 8.93 },
    { name: "Amethyst", rarity: 5.67 },
    { name: "Desert", rarity: 7.89 },
    { name: "Volcanic", rarity: 4.32 },
    { name: "Tropic", rarity: 9.15 },
    { name: "Aqua", rarity: 6.76 },
    { name: "Mist", rarity: 7.54 },
    { name: "Charcoal", rarity: 6.21 },
  ],
  MOTION: [
    { name: "Idle", rarity: 5.67 },
    { name: "Slow Walk", rarity: 7.23 },
    { name: "Walk", rarity: 6.34 },
    { name: "Trot", rarity: 7.89 },
    { name: "Run", rarity: 8.45 },
    { name: "Gallop", rarity: 9.12 },
    // { name: "Fly", rarity: 4.56 },
    // { name: "Glide", rarity: 8.78 },
    // { name: "Flap", rarity: 6.91 },
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
    { name: "0", rarity: 8.45 },
    { name: "1", rarity: 8.45 },
    { name: "2", rarity: 6.78 },
    { name: "3", rarity: 7.23 },
    { name: "4", rarity: 9.12 },
  ],
  CLASS: [
    { name: "Warrior", rarity: 8.12 },
    { name: "Mystic", rarity: 6.74 },
    { name: "Tracker", rarity: 7.93 },
    { name: "Mender", rarity: 5.86 },
    { name: "Stalker", rarity: 9.21 },
    { name: "Defender", rarity: 7.45 },
  ],
};

const COLLECTIONS = {
  GENESIS: {
    name: "The Genesis Collection",
    description:
      "10,222 characters comprising of 7 unique species (Ankylo, Bronto, Dactyl, Raptor, Rex, Stego, Trice) released in November 2022.",
    species: ["Ankylo", "Bronto", "Dactyl", "Raptor", "Rex", "Stego", "Trice"],
  },
  SAGA: {
    name: "Claynosaurz: The Call of Saga",
    description:
      "The Expansion Collection. 2,000 characters comprising of 2 unique species (Para & Spino) released in partnership with Solana Mobile in 2023.",
    species: ["Para", "Spino"],
  },
};

type TraitCategory = keyof typeof TRAITS;
type RandomDinosState = { [key in TraitCategory]?: any[] };

export function TraitGuide() {
  const [selectedCategory, setSelectedCategory] =
    useState<TraitCategory>("SPECIES");
  const [randomDinos, setRandomDinos] = useState<RandomDinosState>({});

  const species = TRAITS.SPECIES.map((s) => s.name);
  const randomSpecies = species[Math.floor(Math.random() * species.length)];
  const traits = TRAITS[selectedCategory].map((t) => t.name);

  const getRandomDinosByTrait = api.trait.getRandomDinosByTrait.useQuery({
    species: randomSpecies ?? "Rex",
    attributeName:
      selectedCategory === "LAYERS"
        ? "layerCount"
        : selectedCategory.toLowerCase(),
    traits: traits,
  });

  const fetchRandomDinos = useCallback(
    async (category: TraitCategory) => {
      if (randomDinos[category]) return; // Don't fetch if we already have data

      const result = await getRandomDinosByTrait.refetch({});

      if (result.data) {
        setRandomDinos((prev) => ({ ...prev, [category]: result.data }));
      }
    },
    [getRandomDinosByTrait, randomDinos]
  );

  useEffect(() => {
    fetchRandomDinos(selectedCategory);
  }, [selectedCategory, fetchRandomDinos]);

  console.log(randomDinos);

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Trait Guide
        </h1>

        {/* Collection introduction */}
        <div className="mb-8 space-y-4">
          {Object.values(COLLECTIONS).map((collection) => (
            <div
              key={collection.name}
              className="rounded-lg bg-neutral-800 p-4"
            >
              <h2 className="mb-2 text-xl font-semibold">{collection.name}</h2>
              <p className="text-sm text-neutral-300">
                {collection.description}
              </p>
            </div>
          ))}
        </div>

        <Tabs
          defaultValue="SPECIES"
          onValueChange={(value) => setSelectedCategory(value as TraitCategory)}
          className="space-y-6"
        >
          <TabsList className="flex flex-wrap justify-center gap-2 rounded-md bg-neutral-800">
            {Object.keys(TRAITS).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-sm px-3 py-1 text-sm font-medium text-white ring-offset-neutral-950 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(TRAITS).map(([category, traits]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {traits.map(({ name, rarity }, index) => (
                  <Card
                    key={name}
                    className="overflow-hidden border-neutral-700 bg-neutral-800"
                  >
                    <CardHeader className="p-0">
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Image
                          src={
                            randomDinos[category as TraitCategory]?.[index]?.gif
                              ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${
                                  randomDinos[category as TraitCategory]?.[
                                    index
                                  ]?.gif
                                }`
                              : `/images/travolta.gif`
                          }
                          alt={`${category} - ${name}`}
                          fill
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="mb-2 text-lg text-white">
                        {name}
                        {category === "SPECIES" && (
                          <span
                            className={`ml-2 text-xs ${
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
                      </CardTitle>
                      <div className="mb-1 flex items-center justify-between text-xs text-neutral-300">
                        <span>Rarity</span>
                        <span>{rarity.toFixed(2)}%</span>
                      </div>
                      <Progress value={rarity} className="h-1 bg-neutral-600" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
