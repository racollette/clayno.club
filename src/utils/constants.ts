// if date is between 2024-02-23 and 2024-03-01, show event alert
export const OLYMPICS_ONGOING = false;

export const COLORS = [
  "Amethyst",
  "Aqua",
  "Charcoal",
  "Desert",
  "Mist",
  "Spring",
  "Tropic",
  "Volcanic",
];
export const SKINS = [
  "Amazonia",
  "Apres",
  "Coral",
  "Cristalline",
  "Elektra",
  "Jurassic",
  "Mirage",
  "Oceania",
  "Savanna",
  "Toxic",
];
export const BACKGROUNDS = [
  "Dune",
  "Lavender",
  "Mint",
  "Peach",
  "Salmon",
  "Sky",
];

export const CLASSES = [
  "Defender",
  "Mender",
  "Mystic",
  "Stalker",
  "Tracker",
  "Warrior",
];

export const SPECIES = [
  "Ankylo",
  "Bronto",
  "Raptor",
  "Rex",
  "Stego",
  "Trice",
  "Para",
  "Spino",
  "Dactyl",
];

export const TIERS = ["Perfect", "Flawless", "Impressive", "Basic"];
export const QUALIFIERS = ["Mighty", "Legendary"];
export const BELLY = ["On"];
export const PATTERN = ["On"];

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
