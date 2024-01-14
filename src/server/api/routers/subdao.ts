import {
  type Discord,
  type Telegram,
  type Twitter,
  type User,
} from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const subdaoRouter = createTRPCRouter({
  getSubDAO: publicProcedure
    .input(z.object({ acronym: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.subDAO.findFirst({
        where: {
          acronym: input.acronym,
        },
        include: {
          dinos: {
            orderBy: {
              rarity: "asc",
            },
            include: {
              attributes: true,
            },
          },
          claymakers: true,
          clay: true,
          holders: {
            orderBy: {
              amount: "desc",
            },
            include: {
              mints: {
                orderBy: {
                  rarity: "asc",
                },
                include: {
                  attributes: true,
                },
              },
            },
          },
        },
      });
    }),

  getAllSubDAOs: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subDAO.findMany({});
  }),

  getHolders: publicProcedure
    .input(
      z.object({
        wallets: z.array(z.string()),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.holder.findMany({
        where: {
          owner: {
            in: input.wallets,
          },
        },
        include: {
          mints: {
            orderBy: {
              rarity: "asc",
            },
            include: {
              attributes: {
                select: {
                  species: true,
                },
              },
            },
            where: {
              attributes: {
                NOT: {
                  species: {
                    in: ["Spino", "Para"],
                  },
                },
              },
            },
          },
        },
      });
    }),

  getUserSubDAOs: publicProcedure
    .input(
      z.object({
        wallets: z.array(z.string()),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.subDAO.findMany({
        where: {
          OR: [
            {
              dinos: {
                some: {
                  holderOwner: {
                    in: input.wallets,
                  },
                },
              },
            },
            {
              claymakers: {
                some: {
                  holderOwner: {
                    in: input.wallets,
                  },
                },
              },
            },
            {
              clay: {
                some: {
                  holderOwner: {
                    in: input.wallets,
                  },
                },
              },
            },
            {
              holders: {
                some: {
                  owner: {
                    in: input.wallets,
                  },
                },
              },
            },
          ],
        },
      });
    }),

  getVerifiedMembers: publicProcedure
    .input(
      z.object({
        acronym: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const tribeHolders = await ctx.prisma.subDAO.findFirst({
        where: {
          acronym: input.acronym,
        },
        include: {
          holders: true,
        },
      });

      if (!tribeHolders) return;

      const holdersArray = tribeHolders.holders.map((holder) => holder.owner);

      const matchingWallets = await ctx.prisma.wallet.findMany({
        where: {
          address: {
            in: holdersArray,
          },
        },
        include: {
          User: {
            include: {
              twitter: true,
              discord: true,
              telegram: true,
            },
          },
        },
      });

      const uniqueUserIds = new Set<string>();
      const uniqueUsers: (User & {
        twitter?: Twitter | null;
        discord?: Discord | null;
        telegram?: Telegram | null;
      })[] = [];

      for (const wallet of matchingWallets) {
        const user = wallet.User;

        if (user && !uniqueUserIds.has(user.id)) {
          uniqueUsers.push(user);
          uniqueUserIds.add(user.id);
        }
      }

      const verifiedUsers: string[] = [];
      const usernames: string[] = [];
      uniqueUsers.forEach((user) => {
        if (user.twitter) {
          usernames.push(user.twitter.username);
          verifiedUsers.push(user.defaultAddress);
        } else if (user.discord) {
          usernames.push(user.discord.username);
          verifiedUsers.push(user.defaultAddress);
        } else if (user.telegram) {
          usernames.push(user.telegram.global_name);
          verifiedUsers.push(user.defaultAddress);
        }
      });

      return verifiedUsers;
    }),
});
