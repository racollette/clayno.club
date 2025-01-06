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
import { api } from "~/utils/api";

export const ANCIENTS = [
  "BBNF7WT3Uo3kHyGveHssQ1KGbKxHL3UsF9J8qYGskXSF", // Kevin
  "4d3CtWyA76yZLmwaaiuF9kgWbd3pMmZnHZtRUoNAP67e", // Dawn
  "2X7XWVSigeiceCPu6N5oUPUpDQntrYxBJvg1d2uTuYZp", // Amber
  "DhrWAQDELvHNSXF5spwrZjd66kiD8fjVSTJ9R9Usk3ug", // Midas Dactyl
  "4pvi6KzZwBoDwzYxoMC7oD7GdLfReFhewxwgDeTZf3AL", // Toly, Tony, Toby
  "HgaQMwhJc1BXwz1xTk9efzuTT3RkwmAvZ4uPBJrtnJnr", // Travis
  "FkuJgKK8BoN6pPKLWZcpcekLB8DRbp3tG2U9f4KRp5nL", // Midas Raptor
  "GGVBRK4FS7QvY1yTGeqJCGudad3SRZzQmozDQ2MQQ9dP", // Tiffany
  "83JwcQXVArbrG2oDRmRPeLzg58DZmm82foARd9MR3V1H", // Tyson
  "6o3gA67byDe7pwcf2v78EsBSu7jCkf6UH5vCgLYZHnMJ", // Midas Bronto
  "E9ucTXmGk836e97dr14RmFX4zRXyiLz3SuF1qiFU9Zed", // Midas Rex
  "6R8rK8rK7mShNEXHgPjLyZrGbdSbrg27EHw79E75yxTP", // Midas Ankylo
  "3CKX1nwCEKeSyBh1ZmD2hy9EstdH2kM1icyw7YZS6h64", // Tom
  "GTjs23M1ntj4GuPijv4tZDC9TJgip3tDhkqyz2hhWPBz", // Tristan
  "J3PLwPzjKV8Pu2XVwSiS5mQkyU5S5Vv7WLfjGE2cmgA9", // Midas Stego
  "HthgzJVNKYeH4PjcwdAnq8qM4HzxzWNK1iEYSrcjAyfe", // Trevor
  "B1rzqj4cEM6pWsrm3rLPCu8QwcXMn6H6bd7xAnk941dU", // Trish
  "AFxpYpFYScQgjr7whSNMay4V3Hg27pz7MMgiUgBVfVTp", // Midas Trice
  "8845gLdhgx1dtm2NSKSPEW5SWoZwQRGcT3vS9bMCkWQX", // Kim
  "12rDcQBjjB4i1x7wzSxaSyhdEMBhwWaEeG8JHS3se4fb", // Kyle
  "Dt3XDSAdXAJbHqvuycgCTHykKCC7tntMFGMmSvfBbpTL", // Midas Para
  "Begwd6UB99zLnTjqyy3oTvdvLAcvEJKa6Y3iGxypGrCu", // Midas Spino
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
      ancientDinos?.map((dino) => ({
        name: dino.attributes?.species ?? "Unknown",
        url: dino.gif
          ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`
          : "",
        attributes: dino.attributes,
      })) || [],
    SPRAYCANS:
      spraycanDinos?.map((dino) => ({
        name: SPRAYCAN_NAMES[dino.mint] ?? "Unknown",
        url: dino.gif
          ? `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.gif}`
          : "",
        attributes: dino.attributes,
      })) || [],
  };

  return (
    <div className="rounded-2xl bg-black px-4 py-8 text-neutral-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Tabs
          defaultValue="ANCIENTS"
          onValueChange={(value) =>
            setSelectedCategory(value as keyof Categories)
          }
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <TabsList className="flex flex-wrap justify-center gap-2 rounded-md bg-neutral-900">
              {(Object.keys(specialsData) as Array<keyof Categories>).map(
                (category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="rounded-sm px-3 py-1 text-sm font-medium text-neutral-300 ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm"
                  >
                    {category}
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </div>

          {(
            Object.entries(specialsData) as Array<
              [keyof Categories, SpecialItem[]]
            >
          ).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {items.map(({ name, url, attributes }) => (
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
                      <h3 className="text-lg font-bold text-neutral-100">
                        {name}
                      </h3>
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
