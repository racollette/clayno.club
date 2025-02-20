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

  updateHerd: protectedProcedure
    .input(
      z.object({
        herdId: z.string(),
        dinoMints: z.array(z.string()), // Array of dino mint addresses to include
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user owns the herd
      const herd = await ctx.prisma.herd.findUnique({
        where: { id: input.herdId },
        include: { dinos: true },
      });

      if (!herd || herd.owner !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      // Get the new dinos
      const newDinos = await ctx.prisma.dino.findMany({
        where: {
          mint: { in: input.dinoMints },
          holderOwner: herd.owner, // Ensure user owns these dinos
        },
        include: { attributes: true },
      });

      if (newDinos.length !== 6) {
        throw new Error("Must include exactly 6 dinos");
      }

      // Calculate new matches and rarity based on the selected dinos
      const { matches, rarity, tier } = calculateHerdStats(newDinos);

      // Update the herd
      return ctx.prisma.herd.update({
        where: { id: input.herdId },
        data: {
          dinos: { set: newDinos },
          matches,
          rarity,
          tier,
          isEdited: true,
        },
        include: { dinos: { include: { attributes: true } } },
      });
    }),
});
