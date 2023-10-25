import { z } from "zod";
import { prisma } from "../../db";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Input } from "~/@/components/ui/input";

export const generalRouter = createTRPCRouter({
  getLastUpdated: publicProcedure.query(async () => {
    return prisma.lastUpdated.findFirst({
      where: {
        id: "lastUpdated",
      },
    });
  }),

  getHolderDinos: protectedProcedure
    .input(z.object({ wallets: z.array(z.string()) }))
    .query(async ({ input }) => {
      return prisma.holder.findMany({
        where: {
          owner: {
            in: input.wallets,
          },
        },
        include: {
          mints: true,
        },
      });
    }),
});
