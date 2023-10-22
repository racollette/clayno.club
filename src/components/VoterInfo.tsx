import { useSession } from "next-auth/react";
import { useUser } from "~/hooks/useUser";
import Image from "next/image";

export default function VoterInfo() {
  const { user, voterInfo, voterInfoLoading } = useUser();
  const { status } = useSession();

  return (
    <>
      {status === "authenticated" && !voterInfoLoading && voterInfo && user ? (
        <div className="flex flex-row items-center justify-center gap-1 rounded-lg bg-fuchsia-700 px-4 py-2">
          <span className="text-sm font-bold">{voterInfo.votesAvailable}</span>
          <Image
            src={"/images/rex_happy.png"}
            alt="RAWR"
            width={20}
            height={20}
            className="scale-x-[-1] transform"
          />
        </div>
      ) : null}
    </>
  );
}
