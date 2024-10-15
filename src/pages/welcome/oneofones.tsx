"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/@/components/ui/tabs";

const SPECIALS = {
  ANCIENTS: [
    {
      name: "Dusk",
      url: "https://cdn.hellomoon.io/public/dactyl/drakenight.gif",
    },
    { name: "Trice", url: "https://example.com/trice.gif" },
    { name: "Stego", url: "https://example.com/stego.gif" },
    { name: "Ankylo", url: "https://example.com/ankylo.gif" },
    { name: "Bronto", url: "https://example.com/bronto.gif" },
    { name: "Raptor", url: "https://example.com/raptor.gif" },
    { name: "Spino", url: "https://example.com/spino.gif" },
    { name: "Para", url: "https://example.com/para.gif" },
    { name: "Dactyl", url: "https://example.com/dactyl.gif" },
  ],
  SPRAYCANS: [
    { name: "Ricardo Cavolo", url: "https://example.com/red-spraycan.gif" },
    { name: "Scum", url: "https://example.com/blue-spraycan.gif" },
    { name: "Hyblinxx", url: "https://example.com/green-spraycan.gif" },
    { name: "Joyce Liu", url: "https://example.com/green-spraycan.gif" },
    { name: "John Le", url: "https://example.com/green-spraycan.gif" },
    { name: "Ben Bauchau", url: "https://example.com/green-spraycan.gif" },
    { name: "Duke", url: "https://example.com/green-spraycan.gif" },
    { name: "Gossip Goblin", url: "https://example.com/green-spraycan.gif" },
    { name: "Mr. Uramaki", url: "https://example.com/green-spraycan.gif" },
    { name: "Zeno", url: "https://example.com/green-spraycan.gif" },
  ],
};

type SpecialCategory = keyof typeof SPECIALS;

export default function OneofOnes() {
  const [selectedCategory, setSelectedCategory] =
    useState<SpecialCategory>("ANCIENTS");

  return (
    <div className="min-h-screen rounded-2xl bg-black px-4 py-8 text-neutral-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="p-2 text-lg font-bold">Special NFTs</div>

        <Tabs
          defaultValue="ANCIENTS"
          onValueChange={(value) =>
            setSelectedCategory(value as SpecialCategory)
          }
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <TabsList className="flex flex-wrap justify-center gap-2 rounded-md bg-neutral-900">
              {Object.keys(SPECIALS).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-sm px-3 py-1 text-sm font-medium text-neutral-300 ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(SPECIALS).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {items.map(({ name, url }) => (
                  <Card
                    key={name}
                    className="overflow-hidden border-neutral-800 bg-neutral-900"
                  >
                    <CardHeader className="p-0">
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Image src={url} alt={name} fill />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="text-lg text-neutral-100">{name}</h3>
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
