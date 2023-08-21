import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Wallet } from "@prisma/client";

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
});
