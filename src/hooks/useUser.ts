import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { getSessionDetails } from "~/utils/session";

export const useUser = () => {
  const { publicKey, connected } = useWallet();

  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | undefined>();
  const { sessionType, id } = getSessionDetails(session);

  const { data: user, isLoading } = api.binding.getUser.useQuery({
    type: connected ? "wallet" : userId ? "id" : sessionType,
    id:
      connected && publicKey
        ? publicKey.toString()
        : userId
        ? userId
        : id ?? "none",
  });

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  return { user: user, isLoading: isLoading };
};
