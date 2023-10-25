import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/ui/dialog";
import { HiAdjustments } from "react-icons/hi";
import { RadioGroup, RadioGroupItem } from "~/@/components/ui/radio-group";
import { BACKGROUNDS, SKINS, COLORS, TIERS } from "~/utils/constants";
import { Label } from "~/@/components/ui/label";
import Link from "next/link";

type FilterDialogProps = {
  skin: string;
  color: string;
  background: string;
  tier: string;
};

export const FilterDialog = ({
  skin,
  color,
  background,
  tier,
}: FilterDialogProps) => {
  const params = {
    skin: skin,
    color: color,
    background: background,
    tier: tier,
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex flex-row items-center gap-2 rounded-md bg-cyan-700 px-4 py-2 text-sm font-bold hover:bg-cyan-600">
            Filters
            <HiAdjustments className="rotate-90" size={20} />
          </button>
        </DialogTrigger>
        <DialogContent className="border-none bg-neutral-900/80">
          <DialogHeader>
            <DialogTitle className="text-white">Filters</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-neutral-500">
            Filter herds by traits
          </DialogDescription>
          <div className="flex flex-col flex-wrap gap-4 text-white">
            <FilterGroup trait={"tier"} params={params} />
            <FilterGroup trait={"skin"} params={params} />
            <FilterGroup trait={"color"} params={params} />
            <FilterGroup trait={"background"} params={params} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
type FilterGroupProps = {
  trait: "skin" | "color" | "background" | "tier";
  params: { skin: string; color: string; background: string; tier: string };
};

function FilterGroup({ trait, params }: FilterGroupProps) {
  const isTraitColor = trait === "color";
  const isTraitSkin = trait === "skin";
  const isTraitBackground = trait === "background";
  const isTraitTier = trait === "tier";
  const traitValue = params[trait];

  //   console.log(traitValue);

  const config = isTraitColor
    ? COLORS
    : isTraitSkin
    ? SKINS
    : isTraitBackground
    ? BACKGROUNDS
    : TIERS;

  const [traitSelected, setTraitSelected] = useState(
    params[trait].toLowerCase()
  );

  const handleTraitSelect = (v: string) => {
    setTraitSelected(v.toLowerCase());
  };

  console.log(traitSelected);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-extrabold">{trait.toUpperCase()}</div>
      <RadioGroup
        defaultValue={"all"}
        value={traitSelected}
        onValueChange={(v) => handleTraitSelect(v)}
        className="flex items-center"
      >
        <div className="flex items-center">
          <div className="grid grid-cols-4 gap-1">
            <div className="flex flex-row items-center gap-1">
              <Link
                href={`?skin=${isTraitSkin ? "all" : params.skin}&color=${
                  isTraitColor ? "all" : params.color
                }&background=${
                  isTraitBackground ? "all" : params.background
                }&tier=${isTraitTier ? "all" : params.tier}`}
                scroll={false}
                className="flex items-center"
              >
                <RadioGroupItem
                  value={"all"}
                  className="h-5 w-5 self-center bg-neutral-700 text-white"
                />
              </Link>

              <Label className="w-20 text-xs font-semibold">All</Label>
            </div>
            {config.map((attribute) => (
              <div key={attribute} className="flex flex-row items-center gap-1">
                <Link
                  href={`?skin=${
                    isTraitSkin ? attribute.toLowerCase() : params.skin
                  }&color=${
                    isTraitColor ? attribute.toLowerCase() : params.color
                  }&background=${
                    isTraitBackground
                      ? attribute.toLowerCase()
                      : params.background
                  }&tier=${
                    isTraitTier ? attribute.toLowerCase() : params.tier
                  }`}
                  scroll={false}
                  className="flex items-center"
                >
                  <RadioGroupItem
                    value={attribute.toLowerCase()}
                    className="h-5 w-5 self-center bg-neutral-700 p-1 text-white"
                  />
                </Link>
                <Label className="w-20 text-xs font-semibold">
                  {attribute}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
