import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/@/components/ui/card";
import { useImageViewer } from "~/hooks/useImageViewer";
import ImageViewer from "~/components/ImageViewer";

type PopularTraitCombo = {
  name: string;
  description: string;
  traits: string[];
  rarity: "Uncommon" | "Rare" | "Super Rare" | "Legendary";
  imageUrl: string;
  tribe?: string;
  marketplaceLinks?: {
    tensor?: string;
    magicEden?: string;
  };
};

const POPULAR_TRAIT_COMBOS: PopularTraitCombo[] = [
  // S TIER
  {
    name: "Mist Apres",
    description:
      "One of the most sought-after combinations in Claynotopia. The ethereal Mist color combined with the snowy Apres texture creates an otherworldly appearance.",
    traits: ["Skin: Apres", "Color: Mist"],
    rarity: "Legendary",
    tribe: "The Lodge",
    imageUrl: "/images/traits/mist_apres.gif",
  },
  {
    name: "Charcoal Apres",
    description:
      "A stunning combination of deep Charcoal with the premium Apres texture. One of the most valuable non-artifact combinations.",
    traits: ["Skin: Apres", "Color: Charcoal"],
    rarity: "Legendary",
    tribe: "The Lodge",
    imageUrl: "/images/traits/charcoal_apres.gif",
  },
  // Super Rare
  {
    name: "Crimson Clan",
    description:
      "The legendary Charcoal Coral combination with Belly trait. Known as the 'Crimson Clan', these are among the most valuable Claynos.",
    traits: ["Skin: Coral", "Color: Charcoal", "Trait: Belly On"],
    rarity: "Super Rare",
    tribe: "Crimson Clan",
    imageUrl: "/images/traits/crimson_clan.gif",
  },
  {
    name: "Toxic Charcoal",
    description:
      "The rare Charcoal color paired with the edgy Toxic skin creates a powerful combination.",
    traits: ["Skin: Toxic", "Color: Charcoal"],
    rarity: "Super Rare",
    imageUrl: "/images/traits/charcoal_toxic.gif",
  },
  {
    name: "Charcoal Elektra",
    description:
      "A premium combination featuring the rare Charcoal color with the electric Elektra skin texture.",
    traits: ["Skin: Elektra", "Color: Charcoal"],
    rarity: "Super Rare",
    imageUrl: "/images/traits/charcoal_elektra.gif",
  },
  {
    name: "Toxic Mist",
    description:
      "The rare Mist color paired with the edgy Toxic skin creates a powerful combination.",
    traits: ["Skin: Toxic", "Color: Mist"],
    rarity: "Super Rare",
    imageUrl: "/images/traits/mist_toxic.gif",
  },
  {
    name: "Mist Elektra",
    description:
      "The ethereal Mist color combined with the dynamic Elektra skin creates a striking appearance.",
    traits: ["Skin: Elektra", "Color: Mist"],
    rarity: "Super Rare",
    imageUrl: "/images/traits/mist_elektra.gif",
  },
  {
    name: "Amethyst Apres",
    description:
      "The mystical Amethyst color paired with the premium Apres skin creates a majestic, royal appearance.",
    traits: ["Skin: Apres", "Color: Amethyst"],
    rarity: "Super Rare",
    tribe: "The Lodge",
    imageUrl: "/images/traits/amethyst_apres.gif",
  },
  {
    name: "Spring Apres",
    description:
      "The vibrant Spring color combined with the premium Apres skin creates a stunning, springtime aesthetic.",
    traits: ["Skin: Apres", "Color: Spring"],
    rarity: "Super Rare",
    tribe: "The Lodge",
    imageUrl: "/images/traits/spring_apres.gif",
  },
  {
    name: "Aqua Apres",
    description:
      "The cool Aqua color paired with the premium Apres skin creates a refreshing, oceanic appearance.",
    traits: ["Skin: Apres", "Color: Aqua"],
    rarity: "Super Rare",
    tribe: "The Lodge",
    imageUrl: "/images/traits/aqua_apres.gif",
  },
  {
    name: "Desert Apres",
    description:
      "The warm Desert color combined with the premium Apres skin creates a sandy, sun-kissed look.",
    traits: ["Skin: Apres", "Color: Desert"],
    rarity: "Super Rare",
    tribe: "The Lodge",
    imageUrl: "/images/traits/desert_apres.gif",
  },
  {
    name: "Volcanic Apres",
    description:
      "The intense Volcanic color paired with the premium Apres skin creates a fiery, dramatic appearance.",
    traits: ["Skin: Apres", "Color: Volcanic"],
    rarity: "Super Rare",
    tribe: "The Lodge",
    imageUrl: "/images/traits/volcanic_apres.gif",
  },
  {
    name: "Tropic Apres",
    description:
      "The lush Tropic color combined with the premium Apres skin creates an exotic, jungle-inspired look.",
    traits: ["Skin: Apres", "Color: Tropic"],
    rarity: "Super Rare",
    tribe: "The Lodge",
    imageUrl: "/images/traits/tropic_apres.gif",
  },
  // Rare
  {
    name: "Solana Skin",
    description:
      "The Amethyst color combined with the Coral skin and green Belly is emblematic of the Solana logo.",
    traits: ["Skin: Coral", "Color: Amethyst", "Belly: On"],
    rarity: "Rare",
    imageUrl: "/images/traits/solana.gif",
  },
  {
    name: "Amethyst Elektra",
    description:
      "A highly desirable combination of the mystical Amethyst color with the energetic Elektra skin.",
    traits: ["Skin: Elektra", "Color: Amethyst"],
    rarity: "Rare",
    imageUrl: "/images/traits/amethyst_elektra.gif",
  },
  {
    name: "Toxic Amethyst",
    description:
      "A highly desirable combination of the mystical Amethyst color with the edgy Toxic skin.",
    traits: ["Skin: Toxic", "Color: Amethyst"],
    rarity: "Rare",
    imageUrl: "/images/traits/amethyst_toxic.gif",
  },
  {
    name: "Coral Mist",
    description:
      "A premium combination featuring the rare Mist color with the vibrant Coral skin.",
    traits: ["Skin: Coral", "Color: Mist"],
    rarity: "Rare",
    imageUrl: "/images/traits/mist_coral.gif",
  },
  {
    name: "Dactyl",
    description:
      "The rarest and most valuable species, Dactyls are highly sought after in any color/skin combination. Members of 'The Nest', these flying Claynos are the most exclusive tribe.",
    traits: ["Species: Dactyl"],
    rarity: "Rare",
    tribe: "The Nest",
    imageUrl: "/images/traits/dactyl.gif",
  },
  {
    name: "4-Layer",
    description:
      "A rare combination where all four skin layers (Back, Belly, Pattern, and Details) are visible, creating a complex and highly detailed appearance.",
    traits: ["Back: On", "Belly: On", "Pattern: On", "Details: On"],
    rarity: "Rare",
    imageUrl: "/images/traits/four_layer.gif",
  },
  {
    name: "0-Layer",
    description:
      "A unique Clayno with no visible skin layers, showcasing the pure color without any additional patterns or markings.",
    traits: ["Back: Off", "Belly: Off", "Pattern: Off", "Details: Off"],
    rarity: "Rare",
    imageUrl: "/images/traits/zero_layer.gif",
  },
  // Uncommon
  {
    name: "Bored Rex",
    description:
      "The iconic Rex species with the Bored mood trait. A popular combination in the community. Members of the 'Bored Bunch' tribe are known for their laid-back attitude.",
    traits: ["Species: Rex", "Mood: Bored"],
    rarity: "Uncommon",
    tribe: "Bored Bunch",
    imageUrl: "/images/traits/bored_rex.gif",
  },
  {
    name: "Sandspark",
    description:
      "The Desert Elektra combination, known as 'Sandspark'. Members of this tribe are recognized for their striking electric patterns on sandy tones.",
    traits: ["Skin: Elektra", "Color: Desert"],
    rarity: "Uncommon",
    tribe: "Sandspark",
    imageUrl: "/images/traits/sandspark.gif",
  },
  {
    name: "Barney",
    description:
      "The popular 'Barney' combination featuring purple tones, reminiscent of the beloved character.",
    traits: ["Color: Spring", "Skin: Crystalline", "Belly: On"],
    rarity: "Uncommon",
    imageUrl: "/images/traits/barney.gif",
  },
  {
    name: "Spyro",
    description:
      "Color and skin combinations that create the beloved 'Spyro' look, popular among collectors.",
    traits: ["Color: Amethyst", "Skin: Crystalline", "Belly: On"],
    rarity: "Uncommon",
    imageUrl: "/images/traits/spyro.gif",
  },
  {
    name: "Yoshi",
    description:
      "Green-toned combinations that create the fan-favorite 'Yoshi' aesthetic.",
    traits: ["Color: Tropic", "Skin: Amazonia", "Belly: On"],
    rarity: "Uncommon",
    imageUrl: "/images/traits/yoshi.gif",
  },
  {
    name: "Toxic",
    description:
      "The edgy Toxic skin paired with colors other than Charcoal, Mist, Amethyst, or Volcanic remains popular.",
    traits: ["Skin: Toxic"],
    rarity: "Uncommon",
    imageUrl: "/images/traits/spring_toxic.gif",
  },
  {
    name: "Coral",
    description:
      "The vibrant Coral skin with colors besides Mist and Amethyst still creates striking combinations.",
    traits: ["Skin: Coral"],
    rarity: "Uncommon",
    imageUrl: "/images/traits/aqua_coral.gif",
  },
  {
    name: "Elektra",
    description:
      "The dynamic Elektra skin with any color besides Charcoal, Mist, or Amethyst still creates desirable combinations.",
    traits: ["Skin: Elektra"],
    rarity: "Uncommon",
    imageUrl: "/images/traits/aqua_elektra.gif",
  },
  {
    name: "Charcoal",
    description:
      "The rare Charcoal color paired with any skin creates desirable combinations due to its scarcity.",
    traits: ["Color: Charcoal"],
    rarity: "Uncommon",
    imageUrl: "/images/traits/charcoal_base.gif",
  },
  {
    name: "Mist",
    description:
      "The ethereal Mist color combined with any skin is highly valued due to its rarity.",
    traits: ["Color: Mist"],
    rarity: "Uncommon",
    imageUrl: "/images/traits/mist_base.gif",
  },
];

function TraitComboCard({ combo }: { combo: PopularTraitCombo }) {
  const { openImage } = useImageViewer();

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openImage(combo.imageUrl);
  };

  const getRarityColor = (rarity: PopularTraitCombo["rarity"]) => {
    switch (rarity) {
      case "Uncommon":
        return "text-green-400";
      case "Rare":
        return "text-blue-400";
      case "Super Rare":
        return "text-purple-400";
      case "Legendary":
        return "text-amber-400";
      default:
        return "text-neutral-400";
    }
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
            src={combo.imageUrl}
            alt={combo.name}
            fill
            className="transition-transform hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-100">{combo.name}</h3>
          <span
            className={`text-sm font-medium ${getRarityColor(combo.rarity)}`}
          >
            {combo.rarity}
          </span>
        </div>
        <p className="mb-3 text-sm text-neutral-400">{combo.description}</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {combo.traits.map((trait) => (
            <span
              key={trait}
              className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300"
            >
              {trait}
            </span>
          ))}
          {combo.tribe && (
            <a
              href={getTribeUrl(combo.tribe)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber-900/50 px-2 py-1 text-xs font-medium text-amber-200 hover:bg-amber-900/70"
            >
              {combo.tribe}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getTribeUrl(tribe: string): string {
  switch (tribe) {
    case "Bored Bunch":
      return "/tribes/bored";
    case "Crimson Clan":
      return "/tribes/tcc";
    case "The Nest":
      return "/tribes/nest";
    case "The Lodge":
      return "/tribes/lodge";
    case "Sandspark":
      return "/tribes/sparks";
    default:
      return "#";
  }
}

export default function PopularTraits() {
  const { selectedImage, isOpen, openImage, closeImage } = useImageViewer();
  const [filter, setFilter] = useState<PopularTraitCombo["rarity"] | "All">(
    "All"
  );

  const filteredCombos =
    filter === "All"
      ? POPULAR_TRAIT_COMBOS
      : POPULAR_TRAIT_COMBOS.filter((combo) => combo.rarity === filter);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(
            ["All", "Uncommon", "Rare", "Super Rare", "Legendary"] as const
          ).map((rarity) => (
            <button
              key={rarity}
              onClick={() => setFilter(rarity)}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                filter === rarity
                  ? "bg-neutral-100 text-neutral-900"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCombos.map((combo) => (
          <TraitComboCard key={combo.name} combo={combo} />
        ))}
      </div>

      {selectedImage && (
        <ImageViewer
          isOpen={true}
          imageUrl={selectedImage}
          onClose={closeImage}
        />
      )}
    </div>
  );
}
