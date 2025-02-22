import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { calculateHerdStats } from "~/utils/calculateHerdStats";

export const herdRouter = createTRPCRouter({
  getAllHerds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.herd.findMany({
      where: {
        NOT: {
          matches: "None",
        },
      },
      include: {
        dinos: {
          include: {
            attributes: true,
          },
        },
      },
      orderBy: [
        {
          tier: "asc",
        },
        {
          rarity: "asc",
        },
      ],
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
    .input(z.object({ tier: z.string() }))
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

  getUserHerds: publicProcedure
    .input(z.array(z.string()))
    .query(({ input: walletAddresses, ctx }) => {
      return ctx.prisma.herd.findMany({
        where: {
          owner: { in: walletAddresses },
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
        dinoMints: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Starting herd update for:", input.herdId);
      console.log("New dino mints:", input.dinoMints);

      // Verify user owns the herd
      const herd = await ctx.prisma.herd.findUnique({
        where: { id: input.herdId },
        include: { dinos: true },
      });

      if (!herd) {
        console.error("Herd not found:", input.herdId);
        throw new Error("Herd not found");
      }

      console.log("Current herd state:", {
        id: herd.id,
        owner: herd.owner,
        currentDinos: herd.dinos.map((d) => d.mint),
      });

      // Get the new dinos
      const dinos = await ctx.prisma.dino.findMany({
        where: {
          mint: { in: input.dinoMints },
        },
        include: { attributes: true },
      });

      console.log(
        "Found new dinos:",
        dinos.map((d) => ({
          mint: d.mint,
          species: d.attributes?.species,
          rarity: d.rarity,
        }))
      );

      // Calculate new herd stats
      const { tier, matches, rarity } = calculateHerdStats(dinos);
      console.log("Calculated new herd stats:", {
        tier,
        matches,
        rarity,
      });

      // Update the herd
      try {
        const updated = await ctx.prisma.herd.update({
          where: { id: input.herdId },
          data: {
            dinos: {
              set: input.dinoMints.map((mint) => ({ mint })),
            },
            tier: tier.toString(),
            matches,
            rarity,
            isEdited: true,
          },
          include: { dinos: { include: { attributes: true } } },
        });
        console.log("Herd updated successfully:", {
          id: updated.id,
          newDinos: updated.dinos.map((d) => d.mint),
        });
        return updated;
      } catch (error) {
        console.error("Error updating herd:", error);
        throw error;
      }
    }),
});
