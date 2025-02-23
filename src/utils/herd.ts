import type { Dino, Attributes } from "@prisma/client";

// Constants
export const REQUIRED_SPECIES = [
  "Rex",
  "Bronto",
  "Raptor",
  "Ankylo",
  "Stego",
  "Trice",
] as const;

export const OPTIONAL_SPECIES = ["Dactyl", "Spino", "Para"] as const;

export const TIER_SCORES = {
  PERFECT: 900,
  FLAWLESS: 750,
  IMPRESSIVE: 500,
  BASIC: 250,
} as const;

export const QUALIFIER_SCORES = {
  Legendary: 200,
  Mighty: 100,
  None: 0,
} as const;

// Types
type HerdAnalysis = {
  tier: "PERFECT" | "FLAWLESS" | "IMPRESSIVE" | "BASIC";
  qualifier: "None" | "Mighty" | "Legendary";
  matches: string;
  rarity: number;
};

export type ScoreBreakdown = {
  tierScore: number;
  qualifierScore: number;
  rarityScore: number;
  totalScore: number;
};

// Functions
export function analyzeHerd(
  dinos: (Dino & { attributes: Attributes | null })[]
): HerdAnalysis {
  // Get reference dino for trait comparison
  const reference = dinos[0]?.attributes;
  if (!reference) {
    return {
      tier: "BASIC",
      qualifier: "None",
      matches: "",
      rarity: 0,
    };
  }

  // Check trait matches across ALL dinos
  const matches = {
    skin: dinos.every((d) => d.attributes?.skin === reference.skin),
    color: dinos.every((d) => d.attributes?.color === reference.color),
    background: dinos.every(
      (d) => d.attributes?.background === reference.background
    ),
    belly: dinos.every((d) => d.attributes?.belly === "On"),
    pattern: dinos.every((d) => d.attributes?.pattern === "On"),
  };

  // Build matches string
  const matchingTraits: string[] = [];
  if (matches.skin) matchingTraits.push(`skin:${reference.skin}`);
  if (matches.color) matchingTraits.push(`color:${reference.color}`);
  if (matches.background)
    matchingTraits.push(`background:${reference.background}`);
  if (matches.belly) matchingTraits.push("belly:On");
  if (matches.pattern) matchingTraits.push("pattern:On");

  // Determine tier based on matching traits
  let tier: HerdAnalysis["tier"] = "BASIC";
  const matchCount = Object.values(matches).filter(Boolean).length;

  if (matchCount >= 4) tier = "PERFECT";
  else if (matchCount === 3) tier = "FLAWLESS";
  else if (matchCount === 2) tier = "IMPRESSIVE";

  // Calculate average rarity of CORE dinos only
  const coreDinos = dinos.filter(
    (dino) =>
      dino.attributes?.species &&
      REQUIRED_SPECIES.includes(
        dino.attributes.species as (typeof REQUIRED_SPECIES)[number]
      )
  );
  const totalRarity = coreDinos.reduce(
    (sum, dino) => sum + (dino.rarity ?? 0),
    0
  );
  const averageRarity = Math.round(totalRarity / coreDinos.length);

  // Determine qualifier based on optional species
  const hasDactyl = dinos.some((d) => d.attributes?.species === "Dactyl");
  const sagaCount = dinos.filter((d) =>
    ["Para", "Spino"].includes(d.attributes?.species ?? "")
  ).length;

  let qualifier: HerdAnalysis["qualifier"] = "None";
  if (hasDactyl && sagaCount >= 2) qualifier = "Legendary";
  else if (hasDactyl || sagaCount >= 2) qualifier = "Mighty";

  return {
    tier,
    qualifier,
    matches: matchingTraits.join(" | "),
    rarity: averageRarity,
  };
}

export function calculateScoreBreakdown(
  tier: string,
  qualifier: string,
  rarity: number
): ScoreBreakdown {
  const tierScore = TIER_SCORES[tier as keyof typeof TIER_SCORES] ?? 0;
  const qualifierScore =
    QUALIFIER_SCORES[qualifier as keyof typeof QUALIFIER_SCORES] ?? 0;
  const rarityScore = Math.max(0, Math.round((10000 - rarity) / 10));

  return {
    tierScore,
    qualifierScore,
    rarityScore,
    totalScore: tierScore + qualifierScore + rarityScore,
  };
}
