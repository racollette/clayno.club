import { type Discord, type Twitter, type Wallet } from "@prisma/client";

type UserWithSocials =
  | {
      discord: Discord | null;
      twitter: Twitter | null;
      id: string;
      defaultAddress: string;
      wallets: Wallet[];
    }
  | undefined;

export const extractProfileFromUser = (user: UserWithSocials) => {
  const username = user?.discord
    ? user.discord.username
    : user?.twitter
    ? user.twitter.username
    : null;
  const userHandle = user?.discord
    ? user.discord.global_name
    : user?.twitter
    ? user.twitter.global_name
    : null;
  const userPFP = user?.discord
    ? user.discord.image_url
    : user?.twitter
    ? user.twitter.image_url
    : null;

  return { userId: user?.id ?? null, username, userHandle, userPFP };
};
