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

type SpraycanItem = {
  mint: string;
  name: string;
  twitter: string;
};

export const SPRAYCANS: SpraycanItem[] = [
  {
    mint: "Ge6ptEDXBC9gJdDAoEoB4fJMFJ4dSEWRsK1dFJTJ7RGu",
    name: "Joyce Liu",
    twitter: "joycelliu",
  },
  {
    mint: "GPfn9DTp9cVWukMifr8DEvo6GBnbJrDKnVF16HKpeSwE",
    name: "John Le",
    twitter: "ProjectJohnLe",
  },
  {
    mint: "a3Mi5uCzdvVZD6Fuw4nNp9NUq7xvPDKEvNaK3FzwKPs",
    name: "Hyblinxx",
    twitter: "hyblinxx",
  },
  {
    mint: "FTJxU3XziqmuKJ47G4FsrKCF6KnWC8iDQkeJ3M4Zfudh",
    name: "Zeno0",
    twitter: "zen0m",
  },
  {
    mint: "9HWP8WSEVCHqiYPcDKa6CtwWcSaM7ffyuN8aXB3HyRmC",
    name: "Duke+1",
    twitter: "dukeplus1",
  },
  {
    mint: "GS4RvEUgd3qLgLJTFEwR37c8ZsgyWLoNsdXKSjecqfoP",
    name: "Mr. Uramaki",
    twitter: "mr_uramaki",
  },
  {
    mint: "8GL55j9vEGgRLyAs7r56iTGdQMxLvoy9QMtepoVZALV3",
    name: "Scum",
    twitter: "scumscumscum",
  },
  {
    mint: "CHDXcyEZgUadbstQ3FGPHhq4Zr1BfVisU4FXpZ7tA8Rq",
    name: "Ricardo Cavolo",
    twitter: "ricardocavolo",
  },
  {
    mint: "Dgy3bPa2HhdV3fqGT4A6tG2bLufD6St32zSsUxwExcZh",
    name: "Gossip Goblin",
    twitter: "gossipgoblin",
  },
  {
    mint: "YjXsghPa1dsy6xc4FLG2W1VLi8CgjntdtYMi3FoTqqw",
    name: "Ben Bauchau",
    twitter: "benbauchau",
  },
];

type SpecialItem = {
  name: string;
  url: string;
  mint?: string;
  twitter?: string;
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
  const { data: spraycanDinos } = api.trait.getDinosByMints.useQuery(
    SPRAYCANS.map((s) => s.mint)
  );

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
        .sort((a: { name: string }, b: { name: string }) => {
          // Put Midas characters at the bottom
          const aIsMidas = a.name.toLowerCase().startsWith("midas");
          const bIsMidas = b.name.toLowerCase().startsWith("midas");

          if (aIsMidas && !bIsMidas) return 1;
          if (!aIsMidas && bIsMidas) return -1;

          // Sort alphabetically within their groups
          return a.name.localeCompare(b.name);
        }) || [],
    SPRAYCANS:
      spraycanDinos?.map((dino) => {
        const spraycan = SPRAYCANS.find((s) => s.mint === dino.mint);
        return {
          name: spraycan?.name ?? "Unknown",
          url: dino.gif
            ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`
            : "",
          mint: dino.mint,
          twitter: spraycan?.twitter,
          attributes: dino.attributes,
        };
      }) || [],
  };

  const { selectedImage, isOpen, openImage, closeImage } = useImageViewer();

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ancients Box */}
        <button
          onClick={() => setSelectedCategory("ANCIENTS")}
          className={`w-full rounded-lg bg-neutral-800 p-3 text-left transition-colors hover:bg-neutral-700 sm:p-6 ${
            selectedCategory === "ANCIENTS" ? "ring-2 ring-amber-500" : ""
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-clayno text-lg text-amber-400 sm:text-xl">Ancients</h3>
              <div className="flex gap-1 sm:gap-2">
                <a
                  href="https://www.tensor.trade/trade/claynosaurz"
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
                  href="https://magiceden.io/marketplace/claynosaurz"
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
              22 legendary characters deeply woven into Claynotopia&apos;s
              lore. These mythical beings play pivotal roles in the
              world&apos;s history and will be featured in
              upcoming episodic content.
            </p>
          </div>
        </button>

        {/* Spray Cans Box */}
        <button
          onClick={() => setSelectedCategory("SPRAYCANS")}
          className={`w-full rounded-lg bg-neutral-800 p-3 text-left transition-colors hover:bg-neutral-700 sm:p-6 ${
            selectedCategory === "SPRAYCANS" ? "ring-2 ring-blue-500" : ""
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-clayno text-lg text-blue-400 sm:text-xl">Spray Cans</h3>
              <div className="flex gap-1 sm:gap-2">
                <a
                  href="https://www.tensor.trade/trade/claynosaurz"
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
                  href="https://magiceden.io/marketplace/claynosaurz"
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
              10 ultra-rare prizes discovered in physical Booster Packs during
              LA and NYC events in 2023. Each Spray Can features a unique
              Clayno designed by one of Solana&apos;s top artists.
            </p>
          </div>
        </button>
      </div>

      <div className="mt-8">
        {selectedCategory === "ANCIENTS" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4">
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
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="min-w-0 truncate text-lg font-bold text-neutral-100">
                      {name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {selectedCategory === "SPRAYCANS" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4">
            {specialsData[selectedCategory].map(({ name, url, mint, twitter, attributes }) => (
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
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="min-w-0 truncate text-lg font-bold text-neutral-100">
                      {name}
                    </h3>
                    {twitter && (
                      <a
                        href={`https://x.com/${twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-shrink-0 items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        @{twitter}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ImageViewer
        isOpen={isOpen}
        imageUrl={selectedImage || ""}
        onClose={closeImage}
      />
    </div>
  );
}
