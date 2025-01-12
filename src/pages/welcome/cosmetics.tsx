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
  twitter?: string;
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
      description: "Exclusive armor set designed by Ben Bauchau.",
      twitter: "benbauchau",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ben_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ben_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ben_art.png",
      },
    },
    {
      name: "Duke+1",
      type: "Full Set",
      description: "Exclusive armor set designed by Duke+1.",
      twitter: "dukeplus1",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/duke_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/duke_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/duke_art.png",
      },
    },
    {
      name: "Gossip Goblin",
      type: "Full Set",
      description: "Exclusive armor set designed by Gossip Goblin.",
      twitter: "gossipgoblin",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/gossip_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/gossip_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/gossip_art.png",
      },
    },
    {
      name: "Hyblinxx",
      type: "Full Set",
      description: "Exclusive armor set designed by Hyblinxx.",
      twitter: "hyblinxx",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/hyblinxx_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/hyblinxx_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/hyblinxx_art.png",
      },
    },
    {
      name: "John Le",
      type: "Full Set",
      description: "Exclusive armor set designed by John Le.",
      twitter: "ProjectJohnLe",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/john_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/john_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/john_art.png",
      },
    },
    {
      name: "Joyce Liu",
      type: "Full Set",
      description: "Exclusive armor set designed by Joyce Liu.",
      twitter: "joycelliu",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/joyce_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/joyce_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/joyce_art.png",
      },
    },
    {
      name: "Mr. Uramaki",
      type: "Full Set",
      description: "Exclusive armor set designed by Mr. Uramaki.",
      twitter: "mr_uramaki",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/uramaki_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/uramaki_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/uramaki_art.png",
      },
    },
    {
      name: "Ricardo Cavolo",
      type: "Full Set",
      description: "Exclusive armor set designed by Ricardo Cavolo.",
      twitter: "ricardocavolo",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ricardo_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ricardo_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/ricardo_art.png",
      },
    },
    {
      name: "Scum",
      type: "Full Set",
      description: "Exclusive armor set designed by Scum.",
      twitter: "scumscumscum",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/scum_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/scum_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/scum_art.png",
      },
    },
    {
      name: "Zen0",
      type: "Full Set",
      description: "Exclusive armor set designed by Zen0.",
      twitter: "zen0m",
      images: {
        full: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/zen0_full.png",
        card: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/zen0_card.png",
        art: "https://arweave.net/Ibs2SrPfQ-ccN_YUYD_01yICSxzFD1O58FFmlXsDWfM/zen0_art.png",
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
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 truncate text-lg font-bold text-neutral-100">
              {item.name}
            </h3>
            {item.twitter && (
              <a
                href={`https://x.com/${item.twitter}`}
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
                @{item.twitter}
              </a>
            )}
          </div>
          <p className="text-sm text-neutral-400">{item.description}</p>
        </div>
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
        <h3 className="font-clayno text-2xl text-white">GEAR</h3>
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
              Clayno&apos;s appearance. These rare items were distributed
              through physical Booster Packs at exclusive events.
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
              inspired by LA&apos;s coastal culture. This set brings a unique
              aquatic aesthetic to your Clayno.
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
