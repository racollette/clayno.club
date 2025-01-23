"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "~/@/components/ui/card";
import { api } from "~/utils/api";
import ImageViewer from "~/components/ImageViewer";
import { useImageViewer } from "~/hooks/useImageViewer";
import {
  ORIGINAL_CLAY_SUPPLY,
  ORIGINAL_CLAYMAKER_SUPPLY,
} from "~/utils/constants";

type ResourceItem = {
  name: string;
  description: string;
  rarity?: string;
  imageUrl: string;
};

function ResourceCard({
  item,
  openImage,
}: {
  item: ResourceItem;
  openImage: (url: string) => void;
}) {
  return (
    <Card className="overflow-hidden border-neutral-800 bg-neutral-900">
      <CardHeader className="p-0">
        <div
          className="relative aspect-square w-full cursor-pointer overflow-hidden"
          onClick={() => openImage(item.imageUrl)}
        >
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="rounded-t-xl object-contain transition-transform hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <h3 className="flex flex-wrap items-center gap-1 text-sm font-bold text-neutral-100 sm:gap-2 sm:text-lg">
          {item.name}
          {item.rarity && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white sm:px-2 sm:text-xs ${
                item.rarity === "Legendary"
                  ? "bg-amber-400"
                  : item.rarity === "Rare"
                  ? "bg-blue-500"
                  : "bg-neutral-500"
              }`}
            >
              {item.rarity}
            </span>
          )}
        </h3>
        <p className="mt-0.5 text-xs text-neutral-400 sm:mt-2 sm:text-sm">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function Resources() {
  const { selectedImage, isOpen, openImage, closeImage } = useImageViewer();
  const [selectedResource, setSelectedResource] = useState<
    "CLAY" | "CLAYMAKERS" | "CLASSES"
  >("CLAY");

  const { data: clayCounts } = api.stats.getMoldedMeterSnapshot.useQuery();
  const { data: makerCounts } = api.stats.getMakerChargesSnapshot.useQuery();

  const CLAY_ITEMS: ResourceItem[] = [
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
  ];

  const CLAYMAKER_ITEMS: ResourceItem[] = [
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
  ];

  const CLASSES_ITEMS: ResourceItem[] = [
    {
      name: "Classes",
      description: "Available classes for each species",
      imageUrl: "/images/species_classes.png",
    },
    {
      name: "Requirements",
      description: "Clay requirements for each class",
      imageUrl: "/images/classes_clay.png",
    },
  ];

  return (
    <>
      <ImageViewer
        isOpen={isOpen}
        imageUrl={selectedImage || ""}
        onClose={closeImage}
      />
      <div className="space-y-4 sm:space-y-8">
        <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
          {/* Clay Card */}
          <button
            onClick={() => setSelectedResource("CLAY")}
            className={`rounded-lg bg-neutral-800 p-3 text-left transition-all hover:bg-neutral-700 sm:p-6 ${
              selectedResource === "CLAY" ? "ring-2 ring-purple-500" : ""
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="flex flex-wrap items-center gap-2 font-clayno text-lg text-purple-400 sm:text-xl">
                  Clay
                </h3>
                <div className="flex gap-1 sm:gap-2">
                  <a
                    href="https://www.tensor.trade/trade/claynosaurz_clay"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                  >
                    <Image
                      src="/icons/tensor.svg"
                      alt="View on Tensor"
                      width={16}
                      height={16}
                      className="opacity-80 sm:h-5 sm:w-5"
                    />
                  </a>
                  <a
                    href="https://magiceden.io/marketplace/claynosaurz_clay"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                  >
                    <Image
                      src="/icons/magic_eden.svg"
                      alt="View on Magic Eden"
                      width={16}
                      height={16}
                      className="opacity-80 sm:h-5 sm:w-5"
                    />
                  </a>
                </div>
              </div>
              <p className="text-sm text-neutral-300">
                The primary crafting resource in Claynotopia. Currently used for
                class selection. Released January 28th 2023.
              </p>
            </div>
          </button>

          {/* Claymakers Card */}
          <button
            onClick={() => setSelectedResource("CLAYMAKERS")}
            className={`rounded-lg bg-neutral-800 p-3 text-left transition-all hover:bg-neutral-700 sm:p-6 ${
              selectedResource === "CLAYMAKERS" ? "ring-2 ring-amber-500" : ""
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="flex flex-wrap items-center gap-2 font-clayno text-lg text-amber-400 sm:text-xl">
                  Claymakers
                </h3>
                <div className="flex gap-1 sm:gap-2">
                  <a
                    href="https://www.tensor.trade/trade/claynosaurz_claymaker"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                  >
                    <Image
                      src="/icons/tensor.svg"
                      alt="View on Tensor"
                      width={16}
                      height={16}
                      className="opacity-80 sm:h-5 sm:w-5"
                    />
                  </a>
                  <a
                    href="https://magiceden.io/marketplace/claynosaurz_claymaker"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600 sm:h-8 sm:w-8"
                  >
                    <Image
                      src="/icons/magic_eden.svg"
                      alt="View on Magic Eden"
                      width={16}
                      height={16}
                      className="opacity-80 sm:h-5 sm:w-5"
                    />
                  </a>
                </div>
              </div>
              <p className="text-sm text-neutral-300">
                Essential crafting tools used to modify and customize your
                Clayno. Required for class selection. Released December 12th
                2023.
              </p>
            </div>
          </button>

          {/* Class Selection Card */}
          <button
            onClick={() => setSelectedResource("CLASSES")}
            className={`rounded-lg bg-neutral-800 p-3 text-left transition-all hover:bg-neutral-700 sm:p-6 ${
              selectedResource === "CLASSES" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="flex flex-wrap items-center gap-2 font-clayno text-lg text-blue-400 sm:text-xl">
                  Class Selection
                </h3>
              </div>
              <p className="text-sm text-neutral-300">
                Choose your Clayno&apos;s role for the upcoming Gameloft game.
                Requires 3x Clay and 1x Claymaker use. Original species can
                choose from 3 specific classes each, with Dactyls, Paras and
                Spinos classes coming soon. Visit the{" "}
                <Link href="/stats" className="text-blue-400 hover:underline">
                  Stats page
                </Link>{" "}
                to see current class distribution and supply numbers.
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 sm:mt-8">
          {selectedResource === "CLAY" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
              {CLAY_ITEMS.map((item) => (
                <ResourceCard
                  key={item.name}
                  item={item}
                  openImage={openImage}
                />
              ))}
            </div>
          )}
          {selectedResource === "CLAYMAKERS" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {CLAYMAKER_ITEMS.map((item) => (
                <ResourceCard
                  key={item.name}
                  item={item}
                  openImage={openImage}
                />
              ))}
            </div>
          )}
          {selectedResource === "CLASSES" && (
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              {CLASSES_ITEMS.map((item) => (
                <ResourceCard
                  key={item.name}
                  item={item}
                  openImage={openImage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
