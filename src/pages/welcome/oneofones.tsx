"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/@/components/ui/card";
import { api } from "~/utils/api";
import { useImageViewer } from "~/hooks/useImageViewer";
import ImageViewer from "~/components/ImageViewer";

export const ANCIENTS = [
  // Non-Midas characters (alphabetically)
  "2X7XWVSigeiceCPu6N5oUPUpDQntrYxBJvg1d2uTuYZp", // Amber
  "4d3CtWyA76yZLmwaaiuF9kgWbd3pMmZnHZtRUoNAP67e", // Dawn
  "8845gLdhgx1dtm2NSKSPEW5SWoZwQRGcT3vS9bMCkWQX", // Kim
  "12rDcQBjjB4i1x7wzSxaSyhdEMBhwWaEeG8JHS3se4fb", // Kyle
  "3CKX1nwCEKeSyBh1ZmD2hy9EstdH2kM1icyw7YZS6h64", // Tom
  "4pvi6KzZwBoDwzYxoMC7oD7GdLfReFhewxwgDeTZf3AL", // Toly, Tony, Toby
  "B1rzqj4cEM6pWsrm3rLPCu8QwcXMn6H6bd7xAnk941dU", // Trish
  "GTjs23M1ntj4GuPijv4tZDC9TJgip3tDhkqyz2hhWPBz", // Tristan
  "HgaQMwhJc1BXwz1xTk9efzuTT3RkwmAvZ4uPBJrtnJnr", // Travis
  "HthgzJVNKYeH4PjcwdAnq8qM4HzxzWNK1iEYSrcjAyfe", // Trevor
  "GGVBRK4FS7QvY1yTGeqJCGudad3SRZzQmozDQ2MQQ9dP", // Tiffany
  "83JwcQXVArbrG2oDRmRPeLzg58DZmm82foARd9MR3V1H", // Tyson
  "BBNF7WT3Uo3kHyGveHssQ1KGbKxHL3UsF9J8qYGskXSF", // Kevin

  // Midas characters
  "6R8rK8rK7mShNEXHgPjLyZrGbdSbrg27EHw79E75yxTP", // Midas Ankylo
  "6o3gA67byDe7pwcf2v78EsBSu7jCkf6UH5vCgLYZHnMJ", // Midas Bronto
  "DhrWAQDELvHNSXF5spwrZjd66kiD8fjVSTJ9R9Usk3ug", // Midas Dactyl
  "Dt3XDSAdXAJbHqvuycgCTHykKCC7tntMFGMmSvfBbpTL", // Midas Para
  "FkuJgKK8BoN6pPKLWZcpcekLB8DRbp3tG2U9f4KRp5nL", // Midas Raptor
  "E9ucTXmGk836e97dr14RmFX4zRXyiLz3SuF1qiFU9Zed", // Midas Rex
  "Begwd6UB99zLnTjqyy3oTvdvLAcvEJKa6Y3iGxypGrCu", // Midas Spino
  "J3PLwPzjKV8Pu2XVwSiS5mQkyU5S5Vv7WLfjGE2cmgA9", // Midas Stego
  "AFxpYpFYScQgjr7whSNMay4V3Hg27pz7MMgiUgBVfVTp", // Midas Trice
];

export const SPRAYCANS = [
  "Ge6ptEDXBC9gJdDAoEoB4fJMFJ4dSEWRsK1dFJTJ7RGu", // Joyce Liu
  "GPfn9DTp9cVWukMifr8DEvo6GBnbJrDKnVF16HKpeSwE", // John Le
  "a3Mi5uCzdvVZD6Fuw4nNp9NUq7xvPDKEvNaK3FzwKPs", // Hyblinxx
  "FTJxU3XziqmuKJ47G4FsrKCF6KnWC8iDQkeJ3M4Zfudh", // Zeno0
  "9HWP8WSEVCHqiYPcDKa6CtwWcSaM7ffyuN8aXB3HyRmC", // Duke+1
  "GS4RvEUgd3qLgLJTFEwR37c8ZsgyWLoNsdXKSjecqfoP", // Mr. Uramaki
  "8GL55j9vEGgRLyAs7r56iTGdQMxLvoy9QMtepoVZALV3", // Scum
  "CHDXcyEZgUadbstQ3FGPHhq4Zr1BfVisU4FXpZ7tA8Rq", // Ricardo Cavolo
  "Dgy3bPa2HhdV3fqGT4A6tG2bLufD6St32zSsUxwExcZh", // Gossip Goblin
  "YjXsghPa1dsy6xc4FLG2W1VLi8CgjntdtYMi3FoTqqw", // Ben Bauchau
];

export const SPRAYCAN_NAMES: Record<string, string> = {
  Ge6ptEDXBC9gJdDAoEoB4fJMFJ4dSEWRsK1dFJTJ7RGu: "Joyce Liu",
  GPfn9DTp9cVWukMifr8DEvo6GBnbJrDKnVF16HKpeSwE: "John Le",
  a3Mi5uCzdvVZD6Fuw4nNp9NUq7xvPDKEvNaK3FzwKPs: "Hyblinxx",
  FTJxU3XziqmuKJ47G4FsrKCF6KnWC8iDQkeJ3M4Zfudh: "Zeno0",
  "9HWP8WSEVCHqiYPcDKa6CtwWcSaM7ffyuN8aXB3HyRmC": "Duke+1",
  GS4RvEUgd3qLgLJTFEwR37c8ZsgyWLoNsdXKSjecqfoP: "Mr. Uramaki",
  "8GL55j9vEGgRLyAs7r56iTGdQMxLvoy9QMtepoVZALV3": "Scum",
  CHDXcyEZgUadbstQ3FGPHhq4Zr1BfVisU4FXpZ7tA8Rq: "Ricardo Cavolo",
  Dgy3bPa2HhdV3fqGT4A6tG2bLufD6St32zSsUxwExcZh: "Gossip Goblin",
  YjXsghPa1dsy6xc4FLG2W1VLi8CgjntdtYMi3FoTqqw: "Ben Bauchau",
};

type SpecialItem = {
  name: string;
  url: string;
  attributes?: Record<string, any> | null;
};

type Categories = {
  ANCIENTS: SpecialItem[];
  SPRAYCANS: SpecialItem[];
};

export default function OneofOnes() {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof Categories>("ANCIENTS");

  const { data: ancientDinos } = api.trait.getDinosByMints.useQuery(ANCIENTS);
  const { data: spraycanDinos } = api.trait.getDinosByMints.useQuery(SPRAYCANS);

  const specialsData: Categories = {
    ANCIENTS:
      ancientDinos
        ?.map((dino) => ({
          name: dino.attributes?.species ?? "Unknown",
          url: dino.gif
            ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`
            : "",
          attributes: dino.attributes,
        }))
        .sort((a, b) => {
          // Put Midas characters at the bottom
          const aIsMidas = a.name.toLowerCase().startsWith("midas");
          const bIsMidas = b.name.toLowerCase().startsWith("midas");

          if (aIsMidas && !bIsMidas) return 1;
          if (!aIsMidas && bIsMidas) return -1;

          // Sort alphabetically within their groups
          return a.name.localeCompare(b.name);
        }) || [],
    SPRAYCANS:
      spraycanDinos?.map((dino) => ({
        name: SPRAYCAN_NAMES[dino.mint] ?? "Unknown",
        url: dino.gif
          ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`
          : "",
        attributes: dino.attributes,
      })) || [],
  };

  const { selectedImage, isOpen, openImage, closeImage } = useImageViewer();

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ancients Box */}
        <div
          className={`rounded-lg bg-neutral-800 p-6 text-left ${
            selectedCategory === "ANCIENTS" ? "ring-2 ring-amber-500" : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <button
              onClick={() => setSelectedCategory("ANCIENTS")}
              className="flex-1 text-left"
            >
              <h3 className="font-clayno text-xl text-amber-400">Ancients</h3>
              <p className="mt-2 text-neutral-300">
                22 legendary characters deeply woven into Claynotopia&apos;s
                rich lore. These mythical beings play pivotal roles in the
                world&apos;s history and will be featured throughout the
                upcoming episodic content.
              </p>
            </button>
            <div className="ml-4 flex gap-2">
              <a
                href="https://www.tensor.trade/trade/claynosaurz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600"
              >
                <Image
                  src="/icons/tensor.svg"
                  alt="View on Tensor"
                  width={20}
                  height={20}
                  className="opacity-80"
                />
              </a>
              <a
                href="https://magiceden.io/marketplace/claynosaurz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600"
              >
                <Image
                  src="/icons/magic_eden.svg"
                  alt="View on Magic Eden"
                  width={20}
                  height={20}
                  className="opacity-80"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Spray Cans Box */}
        <div
          className={`rounded-lg bg-neutral-800 p-6 text-left ${
            selectedCategory === "SPRAYCANS" ? "ring-2 ring-blue-500" : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <button
              onClick={() => setSelectedCategory("SPRAYCANS")}
              className="flex-1 text-left"
            >
              <h3 className="font-clayno text-xl text-blue-400">Spray Cans</h3>
              <p className="mt-2 text-neutral-300">
                10 ultra-rare prizes discovered in physical Booster Packs during
                LA and NYC events in 2023. Each Spray Can features a unique
                Clayno designed by one of Solana&apos;s top artists.
              </p>
            </button>
            <div className="ml-4 flex gap-2">
              <a
                href="https://www.tensor.trade/trade/claynosaurz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600"
              >
                <Image
                  src="/icons/tensor.svg"
                  alt="View on Tensor"
                  width={20}
                  height={20}
                  className="opacity-80"
                />
              </a>
              <a
                href="https://magiceden.io/marketplace/claynosaurz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-700 p-1.5 transition-colors hover:bg-neutral-600"
              >
                <Image
                  src="/icons/magic_eden.svg"
                  alt="View on Magic Eden"
                  width={20}
                  height={20}
                  className="opacity-80"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {specialsData[selectedCategory].map(({ name, url, attributes }) => (
            <Card
              key={name}
              className="overflow-hidden border-neutral-800 bg-neutral-900"
            >
              <CardHeader className="p-0">
                <div
                  className="relative aspect-square w-full cursor-pointer overflow-hidden"
                  onClick={() =>
                    openImage(
                      url.replace(
                        "https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/",
                        ""
                      )
                    )
                  }
                >
                  <Image
                    src={url}
                    alt={name}
                    fill
                    className="transition-transform hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-neutral-100">{name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <ImageViewer
        isOpen={isOpen}
        imageUrl={selectedImage || ""}
        onClose={closeImage}
      />
    </div>
  );
}
