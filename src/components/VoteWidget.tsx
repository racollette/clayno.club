import {
  Attributes,
  Dino,
  Discord,
  Herd,
  Twitter,
  User,
  Voter,
} from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/ui/dialog";

type VoteWidgetProps = {
  voterInfo:
    | (Voter & {
        votes: Herd[];
      })
    | null
    | undefined;
  herd:
    | Herd & {
        dinos: (Dino & {
          attributes: Attributes | null;
        })[];
        voters: (Voter & {
          user: User & {
            discord: Discord | null;
            twitter: Twitter | null;
          };
        })[];
      };

  handleCastVote: (herdId: string) => void;
  handleRemoveVote: (herdId: string) => void;
  voteLoading: boolean;
};

export const VoteWidget = ({
  voterInfo,
  herd,
  handleCastVote,
  handleRemoveVote,
  voteLoading,
}: VoteWidgetProps) => {
  const voted = voterInfo?.votes.some((voteCast) => voteCast.id === herd.id);

  return (
    <div className="flex flex-row items-end gap-2 md:flex-col md:items-center md:gap-4">
      <TooltipProvider>
        {voted ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="relative h-12 w-12 hover:animate-bounce disabled:cursor-not-allowed md:h-20 md:w-20"
                onClick={() => handleRemoveVote(herd.id)}
                disabled={voteLoading}
              >
                <Image
                  src="/images/rex_happy.png"
                  fill
                  alt="Voted"
                  className="scale-x-[-1] transform"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent className="mb-1 rounded-lg bg-white p-2 text-xs font-semibold">
              Remove Vote
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="relative h-12 w-12 hover:animate-bounce disabled:cursor-not-allowed md:h-16 md:w-16"
                onClick={() => handleCastVote(herd.id)}
                disabled={voteLoading}
              >
                <Image
                  src="/images/rex_bored_orange.png"
                  fill
                  alt="Vote"
                  className="scale-x-[-1] transform pl-2"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent className="mb-1 rounded-lg bg-white p-2 text-xs font-semibold">
              Cast Vote
            </TooltipContent>
          </Tooltip>
        )}

        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger
                className={`${
                  voted
                    ? `border-green-400 bg-green-600`
                    : `border-amber-200/80 bg-amber-400/80`
                } aspect-square rounded-lg border-2 px-3 py-1 text-center text-lg font-extrabold text-white hover:animate-pulse md:rounded-xl md:border-4 md:text-2xl`}
              >
                {herd.voters.length}
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent
              className="mt-2 rounded-lg bg-white p-2 text-xs font-semibold"
              side="bottom"
            >
              See Voters
            </TooltipContent>
          </Tooltip>

          <DialogContent className="border-none bg-neutral-900/80">
            <DialogHeader>
              <DialogTitle className="text-white">Voters</DialogTitle>
            </DialogHeader>
            <div className="flex flex-row flex-wrap gap-2">
              {herd.voters.length === 0 ? (
                <Image
                  src={`/images/travolta.gif`}
                  alt={"???"}
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
              ) : (
                <>
                  {herd.voters.map((voter) => {
                    const avatar = voter.user.discord
                      ? voter.user.discord.image_url
                      : voter.user.twitter
                      ? voter.user.twitter?.image_url
                      : `https://ui-avatars.com/api/?name=${voter.user.defaultAddress}&background=random`;
                    return (
                      <div key={voter.userId}>
                        <Tooltip>
                          <TooltipTrigger
                            className={`cursor-pointer overflow-clip rounded-lg`}
                            asChild
                          >
                            <Image
                              src={avatar}
                              alt="PFP"
                              width={32}
                              height={32}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="mb-1 rounded-lg bg-white p-2 font-semibold">
                            {voter.user.discord?.global_name ||
                              voter.user.twitter?.global_name}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </div>
  );
};
