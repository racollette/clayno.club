import React, { useState } from "react";
import TraitGuide from "./trait-guide";
import AncientsCansArtifacts from "./oneofones";
import CosmeticsExplorer from "./cosmetics";
import PopularTraits from "./popular-traits";
import MetaTags from "~/components/MetaTags";
import { useImageViewer } from "~/hooks/useImageViewer";
import ImageViewer from "~/components/ImageViewer";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/@/components/ui/card";
import { api } from "~/utils/api";
import {
  ORIGINAL_CLAY_SUPPLY,
  ORIGINAL_CLAYMAKER_SUPPLY,
} from "~/utils/constants";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "~/@/components/ui/tabs";
import { cn } from "~/@/lib/utils";

type ResourceItem = {
  name: string;
  description: string;
  rarity: string;
  imageUrl: string;
};

const WelcomePage: React.FC = () => {
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
      rarity: "Common",
      imageUrl: "/images/species_classes.png",
    },
    {
      name: "Requirements",
      description: "Clay requirements for each class",
      rarity: "Common",
      imageUrl: "/images/classes_clay.png",
    },
  ];

  function ResourceCard({ item }: { item: ResourceItem }) {
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
        <CardContent className="p-4">
          <h3 className="flex items-center text-lg font-bold text-neutral-100">
            {item.name}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium text-white ${
                item.rarity === "Legendary"
                  ? "bg-amber-400"
                  : item.rarity === "Rare"
                  ? "bg-blue-500"
                  : "bg-neutral-500"
              }`}
            >
              {item.rarity}
            </span>
          </h3>
          <p className="mt-2 text-sm text-neutral-400">{item.description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <MetaTags
        title="Welcome to Claynotopia | Clayno Club"
        description="Welcome to the world of Claynosaurz —an exciting journey awaits. Our Collectors Guide is here to help you navigate the ins and outs of Claynotopia."
      />
      <ImageViewer
        isOpen={isOpen}
        imageUrl={selectedImage || ""}
        onClose={closeImage}
      />
      <div className="min-h-screen bg-black">
        <main className="mx-auto max-w-[1400px] px-4 py-12">
          {/* Hero Section */}
          <section className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-xl">
            <div
              className="absolute inset-0 opacity-[0.25]"
              style={{
                backgroundImage: 'url("/images/clayno_bg.svg")',
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <div className="mx-auto max-w-3xl">
              <div className="relative flex items-center gap-8">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/clayno_logo_vertical_1024x1024.png"
                    alt="Claynosaurz"
                    width={200}
                    height={200}
                  />
                </div>
                <div>
                  <h1 className="mb-6 font-clayno text-4xl text-white">
                    Welcome to Claynotopia!
                  </h1>
                  <p className="text-lg font-medium leading-relaxed text-neutral-200">
                    An exciting journey awaits. Our Collectors Guide is here to
                    help you navigate the ins and outs of Claynosaurz.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="rounded-3xl bg-neutral-900 p-8 shadow-2xl">
            {/* The Characters Introduction */}
            <div>
              <h2 className="mb-4 font-clayno text-3xl text-white">
                The Characters
              </h2>
              <p className="mb-8 text-lg text-neutral-300">
                Characters are your access passes to the Claynotopia ecosystem.
                Each character, whether from Genesis or Saga, carries the same
                core utility and benefits. All of the additional collectibles
                revolve around these characters.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-neutral-800 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-clayno text-xl text-blue-400">
                        Genesis Collection
                        <span className="ml-2 text-sm text-neutral-400">
                          1st Edition
                        </span>
                      </h3>
                      <p className="mt-2 text-neutral-300">
                        10,222 original Claynosaurz released in November 2022
                        featuring seven species: Rex, Trice, Stego, Ankylo,
                        Bronto, Raptor, and Dactyl.
                      </p>
                    </div>
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
                <div className="rounded-lg bg-neutral-800 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-clayno text-xl text-yellow-400">
                        Call of Saga
                        <span className="ml-2 text-sm text-neutral-400">
                          2nd Edition
                        </span>
                      </h3>
                      <p className="mt-2 text-neutral-300">
                        The Expansion Collection. 2,000 characters comprising of
                        2 unique species (Para & Spino) released in partnership
                        with Solana Mobile in March of 2023.
                      </p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <a
                        href="https://www.tensor.trade/trade/saga"
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
                        href="https://magiceden.io/marketplace/claynosaurz_saga"
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
                <div className="mb-6">
                  <h3 className="font-clayno text-2xl text-white">
                    Trait Explorer
                  </h3>
                  <p className="mt-2 text-neutral-400">
                    Compare the different traits side-by-side, or check out the
                    most sought-after combinations.
                  </p>
                </div>
                <Tabs defaultValue="all-traits" className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <TabsList className="flex gap-2 rounded-md bg-neutral-900">
                      <TabsTrigger
                        value="all-traits"
                        className="rounded-sm px-3 py-1 text-sm font-medium text-neutral-300 ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm"
                      >
                        All Traits
                      </TabsTrigger>
                      <TabsTrigger
                        value="popular-traits"
                        className={cn(
                          "relative rounded-sm px-3 py-1 text-sm font-medium text-neutral-300 ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 data-[state=active]:shadow-sm",
                          "after:absolute after:right-0 after:top-0 after:h-2 after:w-2 after:-translate-y-1 after:translate-x-1 after:animate-pulse after:rounded-full after:bg-purple-500"
                        )}
                      >
                        Popular Combinations
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="all-traits">
                    <TraitGuide />
                  </TabsContent>
                  <TabsContent value="popular-traits">
                    <PopularTraits />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="mt-16">
                <h3 className="mb-6 font-clayno text-2xl text-white">
                  One of Ones
                </h3>
                <AncientsCansArtifacts />
              </div>
            </div>
          </section>

          {/* Cosmetics Section */}
          <section className="mt-12 rounded-3xl bg-neutral-900 p-8 shadow-2xl">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-clayno text-3xl text-white">COSMETICS</h2>
                <div className="flex gap-2">
                  <a
                    href="https://www.tensor.trade/trade/saga"
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
                    href="https://magiceden.io/marketplace/claynosaurz_saga"
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
              <p className="mb-8 mt-4 text-lg text-neutral-300">
                The Cosmetics Collection holds unique gear, emotes, and poses to
                customize your Claynosaurz characters. These items will be
                redeemable in the Claynosaurz mobile game (under development).
              </p>
              <div>
                <div className="mt-8">
                  <CosmeticsExplorer />
                </div>
              </div>

              {/* Future Cosmetics */}
              <div className="mt-16 rounded-lg bg-neutral-800 p-6">
                <h4 className="font-clayno text-xl text-purple-400">
                  Coming Soon
                </h4>
                <p className="mt-2 text-neutral-300">
                  Additional cosmetics including emotes, poses, and special
                  effects will be available in the upcoming mobile game. Some
                  items will be exclusive to specific events or achievements.
                </p>
              </div>
            </div>
          </section>

          {/* Resources Section */}
          <section className="mt-12 rounded-3xl bg-neutral-900 p-8 shadow-2xl">
            <div>
              <h2 className="mb-4 font-clayno text-3xl text-white">
                Resources
              </h2>
              <p className="mb-8 text-lg text-neutral-300">
                The Claynosaurz ecosystem is powered by two key resources that
                enhance the utility and experience of character holders.
              </p>
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Clay Card */}
                  <button
                    onClick={() => setSelectedResource("CLAY")}
                    className={`rounded-lg bg-neutral-800 p-6 text-left transition-all hover:bg-neutral-700 ${
                      selectedResource === "CLAY"
                        ? "ring-2 ring-purple-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-clayno text-xl text-purple-400">
                          Clay
                        </h3>
                        <p className="mt-2 text-neutral-300">
                          The primary crafting resource in Claynotopia.
                          Currently used for class selection. Released October
                          17, 2023.
                        </p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <a
                          href="https://www.tensor.trade/trade/claynosaurz_clay"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
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
                          href="https://magiceden.io/marketplace/claynosaurz_clay"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
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
                  </button>

                  {/* Claymakers Card */}
                  <button
                    onClick={() => setSelectedResource("CLAYMAKERS")}
                    className={`rounded-lg bg-neutral-800 p-6 text-left transition-all hover:bg-neutral-700 ${
                      selectedResource === "CLAYMAKERS"
                        ? "ring-2 ring-amber-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-clayno text-xl text-amber-400">
                          Claymakers
                        </h3>
                        <p className="mt-2 text-neutral-300">
                          Essential crafting tools used to modify and customize
                          your Clayno. Required for class selection. Released
                          February 10, 2023.
                        </p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <a
                          href="https://www.tensor.trade/trade/claynosaurz_claymaker"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
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
                          href="https://magiceden.io/marketplace/claynosaurz_claymaker"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
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
                  </button>

                  {/* Class Selection Card */}
                  <button
                    onClick={() => setSelectedResource("CLASSES")}
                    className={`rounded-lg bg-neutral-800 p-6 text-left transition-all hover:bg-neutral-700 ${
                      selectedResource === "CLASSES"
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-clayno text-xl text-blue-400">
                          Class Selection
                        </h3>
                        <p className="text-neutral-300">
                          Choose your Clayno's role for the upcoming Gameloft
                          game. Requires 3x Clay and 1x Claymaker use. Original
                          species can choose from 3 specific classes each, with
                          Dactyls, Paras & Spinos classes coming soon. Visit the{" "}
                          <a
                            href="/stats"
                            className="text-blue-400 hover:underline"
                          >
                            Stats page
                          </a>{" "}
                          to see current class distribution and supply numbers.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-8">
                  {selectedResource === "CLAY" && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {CLAY_ITEMS.map((item) => (
                        <ResourceCard key={item.name} item={item} />
                      ))}
                    </div>
                  )}
                  {selectedResource === "CLAYMAKERS" && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {CLAYMAKER_ITEMS.map((item) => (
                        <ResourceCard key={item.name} item={item} />
                      ))}
                    </div>
                  )}
                  {selectedResource === "CLASSES" && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {CLASSES_ITEMS.map((item) => (
                        <ResourceCard key={item.name} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default WelcomePage;
