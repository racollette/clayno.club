import { useEffect, useState } from "react";
import { useUser } from "~/hooks/useUser";

export default function VoterInfo() {
  const { user, voterInfo, voterInfoLoading } = useUser();

  return (
    <>
      {!voterInfoLoading &&
      voterInfo &&
      user &&
      voterInfo?.votesAvailable >= 0 ? (
        <div className="flex items-center justify-center rounded-lg bg-fuchsia-700 px-3 py-2">
          <span className="text-xs font-bold">
            {voterInfo.votesAvailable} Votes
          </span>
        </div>
      ) : null}
    </>
  );
}
