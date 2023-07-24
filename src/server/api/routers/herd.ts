import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const herdRouter = createTRPCRouter({
  getT1Herds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.herd.findMany({
      where: {
        tier: 1,
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

  getT2Herds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.herd.findMany({
      where: {
        tier: 2,
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

  getT3Herds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.herd.findMany({
      where: {
        tier: 3,
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

  getT4Herds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.herd.findMany({
      where: {
        tier: 4,
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
