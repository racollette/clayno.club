// import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { getSessionDetails } from "~/utils/session";

export const useUser = () => {
  // const { publicKey, connected } = useWallet();
  const { data: session, status } = useSession();

  const [userId, setUserId] = useState<string | undefined>();
  const { id, sessionType } = getSessionDetails(session);

  const { data: user, isLoading: userLoading } = api.binding.getUser.useQuery({
    type: sessionType ?? "none",
    id: id ?? "none",
  });

  // const { data: voterInfo, isLoading: voterInfoLoading } =
  //   api.vote.getVoterInfo.useQuery(
  //     undefined,
  //     {
  //       enabled: !!session?.user,
  //     }
  //   );

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  return {
    user,
    // voterInfo,
    // voterInfoLoading,
    isLoading: userLoading,
    session,
    sessionStatus: status,
  };
};
