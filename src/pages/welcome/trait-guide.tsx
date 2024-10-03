"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
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

const TRAITS = {
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
    { name: "Mirage", rarity: 20.17 },
    { name: "Amazonia", rarity: 13.39 },
    { name: "Jurassic", rarity: 12.96 },
    { name: "Savanna", rarity: 11.34 },
    { name: "Cristalline", rarity: 8.79 },
    { name: "Coral", rarity: 8.36 },
    { name: "Oceania", rarity: 8.0 },
    { name: "Elektra", rarity: 7.72 },
    { name: "Toxic", rarity: 6.09 },
    { name: "Apres", rarity: 2.97 },
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
    { name: "Slow Walk", rarity: 19.75 },
    { name: "Walk", rarity: 19.73 },
    { name: "Trot", rarity: 19.74 },
    { name: "Idle", rarity: 19.52 },
    { name: "Gallop", rarity: 10.54 },
    { name: "Run", rarity: 8.72 },
    { name: "Flap", rarity: 0.61 },
    { name: "Glide", rarity: 0.41 },
    { name: "Fly", rarity: 0.38 },
    { name: "Soar", rarity: 0.38 },
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

export default function TraitGuide() {
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

  const refreshDinos = useCallback(() => {
    setRandomDinos({});
    fetchRandomDinos(selectedCategory);
  }, [selectedCategory, fetchRandomDinos]);

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
          <div className="flex items-center justify-between">
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
            <Button
              onClick={refreshDinos}
              variant="default"
              size="icon"
              className="ml-2 bg-neutral-800 text-white hover:bg-neutral-600"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
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
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-neutral-300">Rarity</span>
                        <span
                          className={cn(
                            rarity <= 1
                              ? "text-red-500"
                              : rarity <= 5
                              ? "text-orange-500"
                              : rarity <= 10
                              ? "text-yellow-500"
                              : rarity <= 15
                              ? "text-green-500"
                              : "text-blue-500"
                          )}
                        >
                          {rarity.toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-700">
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
                              ? "bg-green-500"
                              : "bg-blue-500"
                          )}
                          style={{ width: `${Math.min(rarity * 2, 100)}%` }}
                        ></div>
                      </div>
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
