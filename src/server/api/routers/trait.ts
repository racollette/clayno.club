import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const traitRouter = createTRPCRouter({
  getRandomSpecies: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ ctx, input: species }) => {
      const randomDinos = await Promise.all(
        species.map(async (species) => {
          const count = await ctx.prisma.dino.count({
            where: {
              attributes: {
                species: species,
              },
            },
          });

          if (count === 0) return null;

          const randomIndex = Math.floor(Math.random() * count);

          const dino = await ctx.prisma.dino.findFirst({
            where: {
              attributes: {
                species: species,
              },
            },
            skip: randomIndex,
            select: {
              attributes: {
                select: {
                  species: true,
                },
              },
              gif: true,
            },
          });

          return dino;
        })
      );

      // Filter out null results (if there were no dinos for that species)
      return randomDinos.filter(Boolean);
    }),

  getRandomDinosByTrait: publicProcedure
    .input(
      z.object({
        species: z.string(),
        attributeName: z.string(),
        traits: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const { species, attributeName, traits } = input;

      const randomDinos = await Promise.all(
        traits.map(async (trait) => {
          const dinos = await ctx.prisma.dino.findMany({
            where: {
              attributes: {
                species: species,
                [attributeName]: trait,
              },
            },
            select: {
              gif: true,
              attributes: {
                select: {
                  [attributeName]: true,
                  layerCount: true,
                },
              },
            },
          });

          if (dinos.length === 0) return null;

          const randomIndex = Math.floor(Math.random() * dinos.length);
          return dinos[randomIndex];
        })
      );

      return randomDinos.filter(Boolean);
    }),
});
