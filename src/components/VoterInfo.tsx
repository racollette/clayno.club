import { useSession } from "next-auth/react";
import { useUser } from "~/hooks/useUser";

export default function VoterInfo() {
  const { user, voterInfo, voterInfoLoading } = useUser();
  const { status } = useSession();

  return (
    <>
      {status === "authenticated" && !voterInfoLoading && voterInfo && user ? (
        <div className="flex items-center justify-center rounded-lg bg-fuchsia-700 px-3 py-2">
          <span className="text-xs font-bold">
            {voterInfo.votesAvailable} Votes
          </span>
        </div>
      ) : null}
    </>
  );
}
