type MatchType = {
  skin?: boolean;
  color?: boolean;
  background?: boolean;
};

const TIERS = {
  Skin_Color_Background_Belly: 0,
  Skin_Color_Background: 1,
  Skin_Color: 2,
  Skin_Background: 2,
  Color_Background: 2,
  Skin: 3,
  Color: 3,
  Null: 4,
};

export function calculateHerdStats(
  dinos: {
    rarity?: number | null;
    attributes: {
      skin: string;
      color: string;
      background: string;
      species: string;
    } | null;
  }[]
) {
  // Check matches between dinos
  const matches: MatchType = {};

  // Get the first dino's traits as reference
  const reference = dinos[0]?.attributes;
  if (!reference) return { tier: 4, type: "Null", matches: "None", rarity: 0 };

  // Check if all dinos match each trait
  matches.skin = dinos.every((d) => d.attributes?.skin === reference.skin);
  matches.color = dinos.every((d) => d.attributes?.color === reference.color);
  matches.background = dinos.every(
    (d) => d.attributes?.background === reference.background
  );

  // Count total matches
  const matchCount = Object.values(matches).filter(Boolean).length;

  // Determine type based on matching traits
  let type = "Null";
  if (matches.skin && matches.color && matches.background) {
    type = "Skin_Color_Background";
  } else if (matches.skin && matches.color) {
    type = "Skin_Color";
  } else if (matches.skin && matches.background) {
    type = "Skin_Background";
  } else if (matches.color && matches.background) {
    type = "Color_Background";
  } else if (matches.skin) {
    type = "Skin";
  } else if (matches.color) {
    type = "Color";
  }

  // Get tier from type
  const tier = TIERS[type as keyof typeof TIERS];

  // Calculate matches string
  const matchTypes = [];
  if (matches.skin) matchTypes.push(reference.skin);
  if (matches.color) matchTypes.push(reference.color);
  if (matches.background) matchTypes.push(reference.background);
  const matchesString = matchTypes.length > 0 ? matchTypes.join("_") : "None";

  // Calculate rarity (sum of individual dino rarities)
  const rarity = dinos.reduce((sum, dino) => sum + (dino.rarity ?? 0), 0);

  return {
    tier,
    type,
    matches: matchesString,
    rarity,
  };
}
