import { type Attributes, type Dino } from "@prisma/client";

// type IndexableAttributes = Attributes & {
//   // Define an index signature to allow string indexing
//   [key: string]: string | undefined;
// };

type IndexableAttributes = Attributes & {
  [key: string]: string | null | undefined;
};

export type Character = Dino & {
  attributes: IndexableAttributes | null;
};

export const sortByAttribute = (items: Character[], attribute: string) => {
  return items?.sort((a, b) => {
    const attrA = a.attributes?.[attribute] || "";
    const attrB = b.attributes?.[attribute] || "";
    return attrA.localeCompare(attrB);
  });
};

export const sortByRarity = (items: Character[]) => {
  return items?.sort((a, b) => {
    return (a.rarity ?? 0) - (b.rarity ?? 0); // Sort by the 'rarity' property in ascending order
  });
};
