import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const herdRouter = createTRPCRouter({
  getAllHerds: publicProcedure.query(({ ctx, input }) => {
    return ctx.prisma.herd.findMany({
      orderBy: {
        // voters: {
        //   _count: "desc", // Sort by the number of voters in descending order
        // },
      },
      include: {
        // voters: true,
        dinos: {
          orderBy: {
            attributes: {
              background: "desc",
            },
          },
          include: {
            attributes: true,
          },
        },
      },
    });
  }),

  getHerdById: publicProcedure
    .input(z.object({ herdId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.herd.findUnique({
        where: {
          id: input.herdId,
        },
        include: {
          dinos: {
            orderBy: {
              attributes: {
                background: "desc",
              },
            },
            include: {
              attributes: true,
            },
          },
          // voters: true,
        },
      });
    }),

  getHerdTier: publicProcedure
    .input(z.object({ tier: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.herd.findMany({
        where: {
          tier: input.tier,
        },
        orderBy: {
          rarity: "asc",
        },
        include: {
          dinos: {
            orderBy: {
              attributes: {
                background: "desc",
              },
            },
            include: {
              attributes: true,
            },
          },
        },
      });
    }),

  getUserHerds: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.herd.findMany({
      where: {
        owner: input,
      },
      orderBy: [
        {
          tier: "asc",
        },
        {
          rarity: "asc",
        },
      ],
      include: {
        dinos: {
          orderBy: {
            attributes: {
              background: "desc",
            },
          },
          include: {
            attributes: true,
          },
        },
      },
    });
  }),
});
