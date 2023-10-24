export const getRarityColor = (rank: number) => {
  if (rank > 6088) return "bg-neutral-500";
  if (rank > 3564) return "bg-emerald-600";
  if (rank > 1531) return "bg-blue-400";
  if (rank > 505) return "bg-purple-600";
  if (rank > 102) return "bg-amber-500";
  return "bg-rose-600";
};

export const getTraitBadgeColor = (trait: string) => {
  switch (trait) {
    // Colors
    case "Amethyst":
      return "bg-purple-500";
    case "Aqua":
      return "bg-sky-600";
    case "Charcoal":
      return "bg-neutral-700";
    case "Desert":
      return "bg-yellow-500";
    case "Mist":
      return "bg-slate-400";
    case "Spring":
      return "bg-rose-400";
    case "Tropic":
      return "bg-emerald-500";
    case "Volcanic":
      return "bg-red-600";
    // Skins
    case "Toxic":
      return "bg-lime-600";
    case "Jurassic":
      return "bg-green-600";
    case "Mirage":
      return "bg-pink-400";
    case "Amazonia":
      return "bg-teal-600";
    case "Elektra":
      return "bg-indigo-600";
    case "Cristalline":
      return "bg-emerald-600";
    case "Coral":
      return "bg-cyan-600";
    case "Apres":
      return "bg-purple-800";
    case "Savanna":
      return "bg-orange-400";
    case "Oceania":
      return "bg-blue-700";
    // Backgrounds
    case "Peach":
      return "bg-orange-400";
    case "Mint":
      return "bg-emerald-400";
    case "Sky":
      return "bg-sky-400";
    case "Dune":
      return "bg-orange-300";
    case "Lavender":
      return "bg-fuchsia-300";
    case "Salmon":
      return "bg-red-400";
    // Species
    case "Dactyl":
      return "bg-emerald-600";
    case "Rex":
      return "bg-violet-600";
    case "Raptor":
      return "bg-lime-900";
    case "Stego":
      return "bg-pink-500";
    // Miscellaneous
    case "25":
      return "bg-sky-400";
    case "5":
      return "bg-red-500";
    case "Ancient":
      return "bg-violet-400";
    case "Layer 0":
      return "bg-slate-600";
    case "OR":
      return "";
    case "BellyOn":
      return "bg-rose-600";
    case "Midas":
      return "bg-amber-500";
    case "GoldClay/Maker":
      return "bg-yellow-500";
    // Default
    default:
      return "bg-slate-800";
  }
};

export const getBorderColor = (matches: string) => {
  const color = matches.split("_")[1];
  switch (color) {
    case "Amethyst":
      return "border-purple-500";
    case "Aqua":
      return "border-sky-600";
    case "Charcoal":
      return "border-zinc-500";
    case "Desert":
      return "border-yellow-500";
    case "Mist":
      return "border-slate-300";
    case "Spring":
      return "border-rose-300";
    case "Tropic":
      return "border-emerald-500";
    case "Volcanic":
      return "border-red-600";
    default:
      return "border-slate-100";
  }
};
