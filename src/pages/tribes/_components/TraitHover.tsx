import { type Attributes } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { HiInformationCircle } from "react-icons/hi";

type TraitHoverProps = {
  attributes: Attributes;
};

export function TraitHover({ attributes }: TraitHoverProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HiInformationCircle className="border-1 h-6 w-6 rounded-full bg-white/20 text-black" />
        </TooltipTrigger>
        <TooltipContent className="absolute">
          <section className="m-1 w-64 items-center justify-center rounded-md border-2 border-zinc-500 bg-black p-4">
            <h1 className="mb-4 text-left text-lg">Traits</h1>
            <ul className="flex flex-col divide-y divide-zinc-700">
              {Object.entries(attributes).map(([key, value]) => {
                if (key === "mint") return;
                return (
                  <li key={key} className="grid grid-cols-2 py-1">
                    <div className="justify-self-start">
                      <div className="text-white/80">
                        {`${key.charAt(0).toUpperCase()}${key.slice(1)}`}
                      </div>
                    </div>
                    <div className="justify-self-end font-bold">{value}</div>
                  </li>
                );
              })}
            </ul>
          </section>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
