import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/@/components/ui/tooltip";
import type { ScoreBreakdown } from "~/utils/herd";

type ScoreBadgeProps = {
  score: ScoreBreakdown;
  tier: string;
  qualifier: string;
  rarity: number;
};

export default function ScoreBadge({
  score,
  tier,
  qualifier,
  rarity,
}: ScoreBadgeProps) {
  console.log(score);
  console.log(tier);
  console.log(qualifier);
  console.log(rarity);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              cursor-pointer rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 
              px-1.5 py-0.5 text-xs font-medium text-white shadow-sm 
              transition-all hover:from-blue-600 hover:to-blue-700 
              hover:shadow-lg hover:shadow-blue-500/20
              md:px-2 md:py-1
            `}
          >
            {score.totalScore}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          className="rounded-xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-xl"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-neutral-300">
                Tier (
                {tier.toLowerCase().slice(0, 1).toUpperCase() +
                  tier.toLowerCase().slice(1)}
                )
              </span>
              <span className="font-medium text-emerald-400">
                +{score.tierScore}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-neutral-300">
                {qualifier === "None"
                  ? "Qualifier:"
                  : `Qualifier (${qualifier})`}
              </span>
              <span className="font-medium text-emerald-400">
                +{score.qualifierScore}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-neutral-300">Rarity Bonus</span>
              <span className="font-medium text-emerald-400">
                +{score.rarityScore}
              </span>
            </div>

            <div className="border-t border-neutral-800 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  Total Score:
                </span>
                <span className="text-lg font-bold text-white">
                  {score.totalScore}
                </span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
