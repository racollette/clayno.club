import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const statsRouter = createTRPCRouter({
  getMoldedMeterSnapshot: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.moldedMeterSnapshot.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getClassCountSnapshot: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.classCountSnapshot.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getMakerChargesSnapshot: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.makerChargesSnapshot.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getDinoHolders: publicProcedure.query(async ({ ctx }) => {
    const ogHolders = await ctx.prisma.dino.groupBy({
      by: ["holderOwner"],
      _count: {
        mint: true,
      },
      where: {
        holderOwner: { not: null },
        NOT: {
          attributes: {
            species: { in: ["Spino", "Para"] },
          },
        },
      },
      orderBy: {
        _count: {
          mint: "desc",
        },
      },
    });

    const sagaHolders = await ctx.prisma.dino.groupBy({
      by: ["holderOwner"],
      _count: {
        mint: true,
      },
      where: {
        holderOwner: { not: null },
        attributes: {
          species: { in: ["Spino", "Para"] },
        },
      },
      orderBy: {
        _count: {
          mint: "desc",
        },
      },
    });

    const combinedHolders: {
      holderOwner: string | null;
      ogCount: number;
      sagaCount: number;
    }[] = [];

    // Combine data based on holderOwner (address)
    ogHolders.forEach((ogHolder) => {
      const matchingSagaHolder = sagaHolders.find(
        (sagaHolder) => sagaHolder.holderOwner === ogHolder.holderOwner
      );

      combinedHolders.push({
        holderOwner: ogHolder.holderOwner,
        ogCount: ogHolder._count.mint,
        sagaCount: matchingSagaHolder ? matchingSagaHolder._count.mint : 0,
      });
    });

    return combinedHolders.sort((a, b) => b.ogCount - a.ogCount);
  }),
});
