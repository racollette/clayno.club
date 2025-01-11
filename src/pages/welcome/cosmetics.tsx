"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/@/components/ui/card";
import { useImageViewer } from "~/hooks/useImageViewer";
import ImageViewer from "~/components/ImageViewer";

type ArmorItem = {
  name: string;
  type: "Head" | "Body" | "Feet";
  set: string;
  images: {
    full: string;
    card: string;
    art: string;
  };
};

type ArtifactItem = {
  name: string;
  type: "Full Set";
  description: string;
  images: {
    full: string;
    card: string;
    art: string;
  };
};

type ViewType = "full" | "card" | "art";

type Categories = {
  ARMOR: ArmorItem[];
  ARTIFACTS: ArtifactItem[];
};

// Placeholder data - replace with actual image URLs and data
const COSMETICS_DATA: Categories = {
  ARMOR: [
    {
      name: "Baja Fish Head",
      type: "Head",
      set: "Baja Fish Armor",
      images: {
        full: "/images/cosmetics/baja_fish_head_full.png",
        card: "/images/cosmetics/baja_fish_head_card.png",
        art: "/images/cosmetics/baja_fish_art.png",
      },
    },
    {
      name: "Baja Fish Body",
      type: "Body",
      set: "Baja Fish Armor",
      images: {
        full: "/images/cosmetics/baja_fish_body_full.png",
        card: "/images/cosmetics/baja_fish_body_card.png",
        art: "/images/cosmetics/baja_fish_art.png",
      },
    },
    {
      name: "Baja Fish Feet",
      type: "Feet",
      set: "Baja Fish Armor",
      images: {
        full: "/images/cosmetics/baja_fish_feet_full.png",
        card: "/images/cosmetics/baja_fish_feet_card.png",
        art: "/images/cosmetics/baja_fish_art.png",
      },
    },
    {
      name: "Butter Ball Head",
      type: "Head",
      set: "Butter Ball Armor",
      images: {
        full: "/images/cosmetics/butter_ball_head_full.png",
        card: "/images/cosmetics/butter_ball_head_card.png",
        art: "/images/cosmetics/butter_ball_art.png",
      },
    },
    {
      name: "Butter Ball Body",
      type: "Body",
      set: "Butter Ball Armor",
      images: {
        full: "/images/cosmetics/butter_ball_body_full.png",
        card: "/images/cosmetics/butter_ball_body_card.png",
        art: "/images/cosmetics/butter_ball_art.png",
      },
    },
    {
      name: "Butter Ball Feet",
      type: "Feet",
      set: "Butter Ball Armor",
      images: {
        full: "/images/cosmetics/butter_ball_feet_full.png",
        card: "/images/cosmetics/butter_ball_feet_card.png",
        art: "/images/cosmetics/butter_ball_art.png",
      },
    },
  ],
  ARTIFACTS: [
    {
      name: "Ben Bauchau",
      type: "Full Set",
      description: "A rare full-set transformation",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ben_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ben_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ben_art.png",
      },
    },
  ],
};

function ArmorCard({ item }: { item: ArmorItem }) {
  const [view, setView] = useState<ViewType>("full");
  const { openImage } = useImageViewer();

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const imageUrl = item.images[view];
    console.log("Opening image:", imageUrl);
    openImage(imageUrl);
  };

  return (
    <Card className="overflow-hidden border-neutral-800 bg-neutral-900">
      <CardHeader className="p-0">
        <div
          role="button"
          tabIndex={0}
          className="relative aspect-square w-full cursor-pointer overflow-hidden"
          onClick={handleImageClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleImageClick(e as any);
            }
          }}
        >
          <Image
            src={item.images[view]}
            alt={item.name}
            fill
            className="transition-transform hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 bg-black/50 p-2 backdrop-blur-sm">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setView("full");
              }}
              className={`rounded px-2 py-1 text-xs ${
                view === "full"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Full
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setView("card");
              }}
              className={`rounded px-2 py-1 text-xs ${
                view === "card"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setView("art");
              }}
              className={`rounded px-2 py-1 text-xs ${
                view === "art"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Art
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-neutral-100">{item.name}</h3>
        <p className="text-sm text-neutral-400">{`${item.type} • ${item.set}`}</p>
      </CardContent>
    </Card>
  );
}

function ArtifactCard({ item }: { item: ArtifactItem }) {
  const [view, setView] = useState<ViewType>("full");
  const { openImage } = useImageViewer();

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const imageUrl = item.images[view];
    console.log("Opening artifact image:", imageUrl);
    openImage(imageUrl);
  };

  return (
    <Card className="overflow-hidden border-neutral-800 bg-neutral-900">
      <CardHeader className="p-0">
        <div
          role="button"
          tabIndex={0}
          className="relative aspect-square w-full cursor-pointer overflow-hidden"
          onClick={handleImageClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleImageClick(e as any);
            }
          }}
        >
          <Image
            src={item.images[view]}
            alt={item.name}
            fill
            className="transition-transform hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 bg-black/50 p-2 backdrop-blur-sm">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setView("full");
              }}
              className={`rounded px-2 py-1 text-xs ${
                view === "full"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Full
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setView("card");
              }}
              className={`rounded px-2 py-1 text-xs ${
                view === "card"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setView("art");
              }}
              className={`rounded px-2 py-1 text-xs ${
                view === "art"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Art
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-neutral-100">{item.name}</h3>
        <p className="text-sm text-neutral-400">{item.description}</p>
      </CardContent>
    </Card>
  );
}

export default function CosmeticsExplorer() {
  const { selectedImage, isOpen, openImage, closeImage } = useImageViewer();
  const [selectedSet, setSelectedSet] = useState<
    "ARTIFACTS" | "BAJA" | "BUTTER"
  >("ARTIFACTS");

  const bajaFishArmor = COSMETICS_DATA.ARMOR.filter(
    (item) => item.set === "Baja Fish Armor"
  );
  const butterBallArmor = COSMETICS_DATA.ARMOR.filter(
    (item) => item.set === "Butter Ball Armor"
  );

  useEffect(() => {
    if (isOpen) {
      console.log("ImageViewer state:", { isOpen, selectedImage }); // Debug log
    }
  }, [isOpen, selectedImage]);

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-clayno text-2xl text-white">Gear</h3>
          <div className="flex gap-2">
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

        <div className="grid gap-6 md:grid-cols-3">
          {/* Artifacts Box */}
          <button
            onClick={() => setSelectedSet("ARTIFACTS")}
            className={`rounded-lg bg-neutral-800 p-6 text-left transition-all hover:bg-neutral-700 ${
              selectedSet === "ARTIFACTS" ? "ring-2 ring-purple-500" : ""
            }`}
          >
            <h3 className="font-clayno text-xl text-purple-400">Artifacts</h3>
            <p className="mt-2 text-neutral-300">
              Special full-set transformations that completely change your
              Clayno's appearance. These rare items were distributed through
              physical Booster Packs at exclusive events.
            </p>
          </button>

          {/* Baja Fish Box */}
          <button
            onClick={() => setSelectedSet("BAJA")}
            className={`rounded-lg bg-neutral-800 p-6 text-left transition-all hover:bg-neutral-700 ${
              selectedSet === "BAJA" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <h3 className="font-clayno text-xl text-blue-400">
              Baja Fish Armor
            </h3>
            <p className="mt-2 text-neutral-300">
              A complete armor set featuring head, body, and feet pieces
              inspired by LA's coastal culture. This set brings a unique aquatic
              aesthetic to your Clayno.
            </p>
          </button>

          {/* Butter Ball Box */}
          <button
            onClick={() => setSelectedSet("BUTTER")}
            className={`rounded-lg bg-neutral-800 p-6 text-left transition-all hover:bg-neutral-700 ${
              selectedSet === "BUTTER" ? "ring-2 ring-amber-500" : ""
            }`}
          >
            <h3 className="font-clayno text-xl text-amber-400">
              Butter Ball Armor
            </h3>
            <p className="mt-2 text-neutral-300">
              A complete armor set featuring head, body, and feet pieces
              inspired by Parisian elegance. This set adds a golden, buttery
              sheen to your Clayno.
            </p>
          </button>
        </div>

        <div className="mt-8">
          {selectedSet === "ARTIFACTS" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {COSMETICS_DATA.ARTIFACTS.map((item) => (
                <ArtifactCard key={item.name} item={item} />
              ))}
            </div>
          )}
          {selectedSet === "BAJA" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {bajaFishArmor.map((item) => (
                <ArmorCard key={item.name} item={item} />
              ))}
            </div>
          )}
          {selectedSet === "BUTTER" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {butterBallArmor.map((item) => (
                <ArmorCard key={item.name} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedImage && (
        <ImageViewer
          isOpen={true}
          imageUrl={selectedImage}
          onClose={closeImage}
        />
      )}
    </>
  );
}
