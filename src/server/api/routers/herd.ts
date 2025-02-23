import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { analyzeHerd } from "~/utils/analyzeHerd";

const CORE_SPECIES = [
  "Rex",
  "Bronto",
  "Raptor",
  "Ankylo",
  "Stego",
  "Trice",
] as const;

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

  checkDinoConflicts: protectedProcedure
    .input(
      z.object({
        herdId: z.string(),
        dinoMints: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const conflicts = await ctx.prisma.herd.findMany({
        where: {
          NOT: { id: input.herdId },
          dinos: {
            some: {
              mint: { in: input.dinoMints },
            },
          },
        },
        include: {
          dinos: {
            include: { attributes: true },
          },
        },
      });

      return {
        conflicts: conflicts.map((herd) => ({
          herdId: herd.id,
          tier: herd.tier,
          qualifier: herd.qualifier === "None" ? null : herd.qualifier,
          matches: herd.matches,
          affectedDinos: herd.dinos
            .filter((d) => input.dinoMints.includes(d.mint))
            .map((d) => ({
              mint: d.mint,
              species: d.attributes?.species ?? "Unknown",
              image: `https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${d.gif}`,
            })),
        })),
      };
    }),

  updateHerd: protectedProcedure
    .input(
      z.object({
        herdId: z.string(),
        dinoMints: z.array(z.string()),
        tier: z.enum(["PERFECT", "FLAWLESS", "IMPRESSIVE", "BASIC"]),
        qualifier: z.enum(["None", "Mighty", "Legendary"]),
        matches: z.string(),
        rarity: z.number(),
        isEdited: z.boolean(),
        isBroken: z.boolean(),
        dinoOrder: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find affected herds
      const affectedHerds = await ctx.prisma.herd.findMany({
        where: {
          NOT: { id: input.herdId },
          dinos: {
            some: {
              mint: { in: input.dinoMints },
            },
          },
        },
        include: {
          dinos: {
            include: { attributes: true },
          },
        },
      });

      // Update all affected herds first
      await Promise.all(
        affectedHerds.map(async (herd) => {
          // Remove the transferred dinos
          const remainingDinos = herd.dinos.filter(
            (d) => !input.dinoMints.includes(d.mint)
          );

          // Check if any core species are being removed
          const removedDinos = herd.dinos.filter((d) =>
            input.dinoMints.includes(d.mint)
          );
          const removingCoreSpecies = removedDinos.some(
            (d) =>
              d.attributes?.species &&
              ["Rex", "Bronto", "Raptor", "Ankylo", "Stego", "Trice"].includes(
                d.attributes.species
              )
          );

          // Analyze new state
          const analysis = analyzeHerd(remainingDinos);

          // Update the affected herd
          await ctx.prisma.herd.update({
            where: { id: herd.id },
            data: {
              dinos: {
                set: remainingDinos.map((d) => ({ mint: d.mint })),
              },
              tier: analysis.tier,
              qualifier: analysis.qualifier,
              matches: analysis.matches,
              rarity: analysis.rarity,
              isEdited: true,
              // Mark as broken if core species was removed
              isBroken: removingCoreSpecies,
            },
          });
        })
      );

      // Now update the target herd
      try {
        const updated = await ctx.prisma.herd.update({
          where: { id: input.herdId },
          data: {
            dinos: {
              set: input.dinoMints.map((mint) => ({ mint })),
            },
            tier: input.tier,
            qualifier: input.qualifier,
            matches: input.matches,
            rarity: input.rarity,
            isEdited: input.isEdited,
            isBroken: input.isBroken,
            dinoOrder: input.dinoOrder,
          },
          include: { dinos: { include: { attributes: true } } },
        });

        return updated;
      } catch (error) {
        console.error("Error updating herd:", error);
        throw error;
      }
    }),

  createHerd: protectedProcedure
    .input(
      z.object({
        owner: z.string(),
        dinoMints: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the dinos data
      const dinos = await ctx.prisma.dino.findMany({
        where: {
          mint: { in: input.dinoMints },
        },
        include: {
          attributes: true,
        },
      });

      // Analyze the herd
      const analysis = analyzeHerd(dinos);

      // Check if all core species are present
      const coreDinos = dinos.filter(
        (dino) =>
          dino.attributes?.species &&
          CORE_SPECIES.includes(
            dino.attributes.species as (typeof CORE_SPECIES)[number]
          )
      );
      const isBroken = coreDinos.length !== CORE_SPECIES.length;

      // Create the herd with dinoOrder
      return ctx.prisma.herd.create({
        data: {
          owner: input.owner,
          dinos: {
            connect: input.dinoMints.map((mint) => ({ mint })),
          },
          tier: analysis.tier,
          qualifier: analysis.qualifier,
          matches: analysis.matches,
          rarity: analysis.rarity,
          isEdited: true,
          isBroken,
          dinoOrder: input.dinoMints.join(","),
        },
        include: {
          dinos: {
            include: {
              attributes: true,
            },
          },
        },
      });
    }),

  deleteHerd: protectedProcedure
    .input(
      z.object({
        herdId: z.string(),
        owner: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the user owns the herd
      const herd = await ctx.prisma.herd.findUnique({
        where: { id: input.herdId },
      });

      if (!herd || herd.owner !== input.owner) {
        throw new Error("Unauthorized to delete this herd");
      }

      // Delete the herd
      return ctx.prisma.herd.delete({
        where: { id: input.herdId },
      });
    }),
});
