import { z } from "zod";
import { prisma } from "../../db";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const inventoryRouter = createTRPCRouter({
  getUserItems: publicProcedure
    .input(
      z.object({
        wallets: z.array(z.string()),
      })
    )
    .query(async ({ input }) => {
      return prisma.holder.findMany({
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
              attributes: true,
            },
          },
          clay: {
            orderBy: {
              rarity: "asc",
            },
          },
          claymakers: {
            orderBy: {
              rarity: "asc",
            },
          },
          consumables: true,
        },
      });
    }),

  findHolder: publicProcedure.input(z.string()).query(async ({ input }) => {
    return prisma.holder.findMany({
      where: {
        owner: input, // Match owner with the provided input
        // OR: [
        //   { mints: { some: {} } }, // Check if mints array has elements
        //   { clay: { some: {} } }, // Check if clay array has elements
        //   { claymakers: { some: {} } }, // Check if claymakers array has elements
        //   { consumables: { some: {} } }, // Check if consumables array has elements
        // ],
      },
    });
  }),
});
