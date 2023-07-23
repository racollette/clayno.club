// @ts-nocheck
import { Session } from "next-auth/core/types";

export const getSessionDetails = (session: Session | null) => {
  const sessionType = session?.user?.image?.includes("discordapp")
    ? "discord"
    : session?.user?.image?.includes("twimg")
    ? "twitter"
    : "wallet";

  const id =
    sessionType === "twitter"
      ? session?.user.profile.data.username
      : sessionType === "discord"
      ? session?.user.profile.username
      : session?.user.name;

  return { sessionType, id };
};
