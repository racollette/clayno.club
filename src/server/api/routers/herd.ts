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
        rarity: "asc",
      },
      include: {
        herd: {
          orderBy: {
            name: "desc",
          },
          include: {
            attributes: true,
          },
        },
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
          herd: {
            orderBy: {
              name: "desc",
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
        herd: {
          orderBy: {
            name: "desc",
          },
          include: {
            attributes: true,
          },
        },
      },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
