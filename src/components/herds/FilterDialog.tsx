import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/@/components/ui/dialog";
import { HiAdjustments, HiX } from "react-icons/hi";
import { RadioGroup, RadioGroupItem } from "~/@/components/ui/radio-group";
import {
  BACKGROUNDS,
  SKINS,
  COLORS,
  BELLY,
  QUALIFIERS,
  TIERS,
} from "~/utils/constants";
import { Label } from "~/@/components/ui/label";
import Link from "next/link";

interface FilterDialogProps {
  skin: string;
  color: string;
  background: string;
  tier: string;
  belly: string;
  pattern: string;
  qualifier: string;
  className?: string;
}

const FilterDialog = ({
  skin,
  color,
  background,
  tier,
  belly,
  pattern,
  qualifier,
  className,
}: FilterDialogProps) => {
  const params = {
    skin: skin,
    color: color,
    background: background,
    tier: tier,
    belly: belly === "belly" ? "on" : "all",
    pattern: pattern === "pattern" ? "on" : "all",
    qualifier: qualifier,
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className={
              className ||
              "flex flex-row items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 font-medium hover:bg-neutral-700"
            }
          >
            <HiAdjustments className="rotate-90" size={20} />
            Filters
          </button>
        </DialogTrigger>
        <DialogContent className="mx-auto max-w-[95%] rounded-lg border-none bg-neutral-900/90 sm:max-w-[500px]">
          <DialogHeader className="relative">
            <DialogTitle className="self-start font-clayno text-white">
              Filters
            </DialogTitle>
            <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-neutral-100">
              <HiX className="h-6 w-6 text-neutral-300" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <DialogDescription className="text-neutral-500">
            Filter herds by traits
          </DialogDescription>
          <div className="flex flex-col flex-wrap gap-4 text-white">
            <FilterGroup trait={"tier"} params={params} />
            <FilterGroup trait={"qualifier"} params={params} />
            <FilterGroup trait={"skin"} params={params} />
            <FilterGroup trait={"color"} params={params} />
            <FilterGroup trait={"background"} params={params} />
            <FilterGroup trait={"belly"} params={params} />
            <FilterGroup trait={"pattern"} params={params} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type FilterGroupProps = {
  trait:
    | "skin"
    | "color"
    | "background"
    | "tier"
    | "belly"
    | "qualifier"
    | "pattern";
  params: {
    skin: string | null;
    color: string | null;
    background: string | null;
    tier: string | null;
    belly: string;
    pattern: string;
    qualifier: string | null;
  };
};

function FilterGroup({ trait, params }: FilterGroupProps) {
  const isTraitColor = trait === "color";
  const isTraitSkin = trait === "skin";
  const isTraitBackground = trait === "background";
  const isTraitTier = trait === "tier";
  const isTraitBelly = trait === "belly";
  const isTraitQualifier = trait === "qualifier";
  const isTraitPattern = trait === "pattern";

  const config = isTraitColor
    ? COLORS
    : isTraitSkin
    ? SKINS
    : isTraitBackground
    ? BACKGROUNDS
    : isTraitTier
    ? TIERS
    : isTraitPattern || isTraitBelly
    ? ["On"]
    : isTraitQualifier
    ? QUALIFIERS
    : BELLY;

  const [traitSelected, setTraitSelected] = useState(
    (params[trait] ?? "all").toLowerCase()
  );

  const handleTraitSelect = (v: string) => {
    setTraitSelected(v.toLowerCase());
  };

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
                }&tier=${isTraitTier ? "all" : params.tier}&belly=${
                  isTraitBelly ? "all" : params.belly
                }&pattern=${
                  isTraitPattern ? "all" : params.pattern
                }&qualifier=${params.qualifier}`}
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
                  }&belly=${
                    isTraitBelly ? attribute.toLowerCase() : params.belly
                  }&pattern=${
                    isTraitPattern ? attribute.toLowerCase() : params.pattern
                  }&qualifier=${params.qualifier}`}
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

export default FilterDialog;
