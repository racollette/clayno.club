export const COLORS = [
  "Charcoal",
  "Mist",
  "Aqua",
  "Desert",
  "Volcanic",
  "Tropic",
  "Amethyst",
  "Spring",
];
export const SKINS = [
  "Apres",
  "Mirage",
  "Jurassic",
  "Toxic",
  "Coral",
  "Elektra",
  "Cristalline",
  "Oceania",
  "Savanna",
  "Amazonia",
];
export const BACKGROUNDS = [
  "Salmon",
  "Lavender",
  "Peach",
  "Sky",
  "Mint",
  "Dune",
];
export const TIERS = ["Perfect", "Epic", "Rare", "Scrappy"];

export const ORIGINAL_CLAY_SUPPLY = {
  red: 4942,
  green: 5132,
  yellow: 5117,
  white: 5630,
  blue: 5221,
  black: 4973,
  total: 31015,
};

export const ORIGINAL_CLAYMAKER_SUPPLY = {
  first: 8057,
  deluxe: 1743,
  limited: 184,
};

type ClayClassResources = {
  warrior: string[];
  mystic: string[];
  stalker: string[];
  mender: string[];
  defender: string[];
  tracker: string[];
  [key: string]: string[];
};

export const CLAY_CLASS_RESOURCES: ClayClassResources = {
  warrior: ["white", "green", "blue"],
  mystic: ["yellow", "black", "blue"],
  stalker: ["green", "white", "red"],
  mender: ["black", "red", "yellow"],
  defender: ["white", "green", "yellow"],
  tracker: ["red", "blue", "black"],
};
