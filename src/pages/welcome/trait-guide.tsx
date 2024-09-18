"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/@/components/ui/card";
import { Progress } from "~/@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/@/components/ui/tabs";

const TRAITS = {
  SKINS: [
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
  CLASSES: [
    { name: "Warrior", rarity: 8.12 },
    { name: "Mystic", rarity: 6.74 },
    { name: "Tracker", rarity: 7.93 },
    { name: "Mender", rarity: 5.86 },
    { name: "Stalker", rarity: 9.21 },
    { name: "Defender", rarity: 7.45 },
  ],
  MOODS: [
    { name: "Happy", rarity: 6.32 },
    { name: "Scared", rarity: 8.74 },
    { name: "Bored", rarity: 7.15 },
    { name: "Smug", rarity: 5.93 },
    { name: "Confident", rarity: 9.46 },
    { name: "Sad", rarity: 4.87 },
    { name: "Excited", rarity: 8.29 },
    { name: "Sleepy", rarity: 6.78 },
  ],
  COLORS: [
    { name: "Mist", rarity: 7.54 },
    { name: "Charcoal", rarity: 6.21 },
    { name: "Spring", rarity: 8.93 },
    { name: "Amethyst", rarity: 5.67 },
    { name: "Desert", rarity: 7.89 },
    { name: "Volcanic", rarity: 4.32 },
    { name: "Tropic", rarity: 9.15 },
    { name: "Aqua", rarity: 6.76 },
  ],
  MOTIONS: [
    { name: "Run", rarity: 8.45 },
    { name: "Idle", rarity: 5.67 },
    { name: "Slow Walk", rarity: 7.23 },
    { name: "Gallop", rarity: 9.12 },
    { name: "Walk", rarity: 6.34 },
    { name: "Trot", rarity: 7.89 },
    { name: "Fly", rarity: 4.56 },
    { name: "Glide", rarity: 8.78 },
    { name: "Flap", rarity: 6.91 },
  ],
  BACKGROUNDS: [
    { name: "Lavender", rarity: 7.34 },
    { name: "Mint", rarity: 8.56 },
    { name: "Peach", rarity: 6.78 },
    { name: "Sky", rarity: 9.23 },
    { name: "Salmon", rarity: 5.67 },
    { name: "Dune", rarity: 7.89 },
  ],
  LAYERS: [
    { name: "1", rarity: 8.45 },
    { name: "2", rarity: 6.78 },
    { name: "3", rarity: 7.23 },
    { name: "4", rarity: 9.12 },
  ],
};

type TraitCategory = keyof typeof TRAITS;

export function TraitGuide() {
  const [selectedCategory, setSelectedCategory] = useState<TraitCategory>("SKINS");

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Claynosaurz Trait Guide
        </h1>
        <Tabs
          defaultValue="SKINS"
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
                {traits.map(({ name, rarity }) => (
                  <Card
                    key={name}
                    className="overflow-hidden border-neutral-700 bg-neutral-800"
                  >
                    <CardHeader className="p-0">
                      <img
                        src="/gifs/TTT.gif"
                        alt={`${selectedCategory} - ${name}`}
                        className="h-40 w-full object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="mb-2 text-lg text-white">{name}</CardTitle>
                   
                      <div className="mb-1 flex items-center justify-between text-xs text-neutral-300">
                        <span>Rarity</span>
                        <span>{rarity.toFixed(2)}%</span>
                      </div>
                      <Progress
                        value={rarity}
                        className="h-1 bg-neutral-600"
                      />
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
