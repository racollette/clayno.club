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
import {
  ORIGINAL_CLAY_SUPPLY,
  ORIGINAL_CLAYMAKER_SUPPLY,
} from "~/utils/constants";
import { api } from "~/utils/api";
import ImageViewer from "~/components/ImageViewer";
import { useImageViewer } from "~/hooks/useImageViewer";

type ResourceItem = {
  name: string;
  description: string;
  rarity: string;
  imageUrl: string;
};

type Categories = {
  CLAY: ResourceItem[];
  CLAYMAKERS: ResourceItem[];
  CLASSES: ResourceItem[];
};

const RarityBadge: React.FC<{ rarity: string }> = ({ rarity }) => {
  const colors = {
    Common: "bg-neutral-500",
    Rare: "bg-blue-500",
    Epic: "bg-purple-500",
    Legendary: "bg-amber-400",
  };

  return (
    <span
      className={`${
        colors[rarity as keyof typeof colors]
      } ml-2 rounded-full px-2 py-0.5 text-xs font-medium text-white`}
    >
      {rarity}
    </span>
  );
};

export default function Resources() {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof Categories>("CLAY");
  const { selectedImage, isOpen, openImage, closeImage } = useImageViewer();

  const { data: clayCounts } = api.stats.getMoldedMeterSnapshot.useQuery();
  const { data: makerCounts } = api.stats.getMakerChargesSnapshot.useQuery();

  const RESOURCES: Categories = {
    CLAY: [
      {
        name: "White",
        description: clayCounts
          ? `${clayCounts.white}/${ORIGINAL_CLAY_SUPPLY.white} remaining`
          : "Loading...",
        rarity: "Common",
        imageUrl: "/images/white.png",
      },
      {
        name: "Blue",
        description: clayCounts
          ? `${clayCounts.blue}/${ORIGINAL_CLAY_SUPPLY.blue} remaining`
          : "Loading...",
        rarity: "Common",
        imageUrl: "/images/blue.png",
      },
      {
        name: "Green",
        description: clayCounts
          ? `${clayCounts.green}/${ORIGINAL_CLAY_SUPPLY.green} remaining`
          : "Loading...",
        rarity: "Common",
        imageUrl: "/images/green.png",
      },

      {
        name: "Yellow",
        description: clayCounts
          ? `${clayCounts.yellow}/${ORIGINAL_CLAY_SUPPLY.yellow} remaining`
          : "Loading...",
        rarity: "Common",
        imageUrl: "/images/yellow.png",
      },

      {
        name: "Black",
        description: clayCounts
          ? `${clayCounts.black}/${ORIGINAL_CLAY_SUPPLY.black} remaining`
          : "Loading...",
        rarity: "Common",
        imageUrl: "/images/black.png",
      },
      {
        name: "Red",
        description: clayCounts
          ? `${clayCounts.red}/${ORIGINAL_CLAY_SUPPLY.red} remaining`
          : "Loading...",
        rarity: "Common",
        imageUrl: "/images/red.png",
      },
      {
        name: "Gold Clay",
        description: "5/5 remaining",
        rarity: "Legendary",
        imageUrl: "/images/gold.png",
      },
    ],
    CLAYMAKERS: [
      {
        name: "First Edition",
        description: makerCounts
          ? `${makerCounts.first}/${ORIGINAL_CLAYMAKER_SUPPLY.first} remaining`
          : "Loading...",
        rarity: "Common",
        imageUrl: "/images/first_claymaker.gif",
      },
      {
        name: "Deluxe",
        description: makerCounts
          ? `${makerCounts.deluxe}/${ORIGINAL_CLAYMAKER_SUPPLY.deluxe} remaining (${makerCounts.deluxeCharges} charges)`
          : "Loading...",
        rarity: "Rare",
        imageUrl: "/images/deluxe_claymaker.gif",
      },
      {
        name: "Limited Edition",
        description: makerCounts
          ? `${makerCounts.limited}/${ORIGINAL_CLAYMAKER_SUPPLY.limited} remaining (24h cooldown)`
          : "Loading...",
        rarity: "Legendary",
        imageUrl: "/images/limited_claymaker.gif",
      },
    ],
    CLASSES: [
      {
        name: "Classes",
        description: "Available classes for each species",
        rarity: "Common",
        imageUrl: "/images/species_classes.png",
      },
      {
        name: "Requirements",
        description: "Clay requirements for each class",
        rarity: "Common",
        imageUrl: "/images/classes_clay.png",
      },
    ],
  };

  return (
    <>
      <ImageViewer
        isOpen={isOpen}
        imageUrl={selectedImage || ""}
        onClose={closeImage}
      />
      <div className="rounded-2xl bg-black px-4 py-8 text-neutral-200 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Tabs
            defaultValue="CLAY"
            onValueChange={(value) =>
              setSelectedCategory(value as keyof Categories)
            }
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <TabsList className="flex flex-wrap justify-center gap-2 rounded-xl bg-neutral-900">
                {(Object.keys(RESOURCES) as Array<keyof Categories>).map(
                  (category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="rounded-lg px-3 py-1 text-sm font-medium text-neutral-300 ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm"
                    >
                      {category}
                    </TabsTrigger>
                  )
                )}
              </TabsList>
            </div>

            {(
              Object.entries(RESOURCES) as Array<
                [keyof Categories, ResourceItem[]]
              >
            ).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div
                  className={`grid gap-4 ${
                    category === "CLASSES"
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  }`}
                >
                  {items.map(({ name, description, rarity, imageUrl }) => (
                    <Card
                      key={name}
                      className="overflow-hidden rounded-xl border-neutral-800 bg-neutral-900"
                    >
                      <CardHeader className="p-0">
                        <div
                          className="relative aspect-square w-full cursor-pointer overflow-hidden"
                          onClick={() => openImage(imageUrl)}
                        >
                          <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="rounded-t-xl object-contain p-4 transition-transform hover:scale-105"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="flex items-center text-lg font-bold text-neutral-100">
                          {name}
                          <RarityBadge rarity={rarity} />
                        </h3>
                        <p className="mt-2 text-sm text-neutral-400">
                          {description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}
