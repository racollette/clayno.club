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

  getDinoHoldersByTrait: publicProcedure
    .input(
      z.object({
        skin: z.string(),
        species: z.string(),
        color: z.string(),
        class: z.string(),
        tribeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        holderOwner: { not: null },
        NOT: {
          attributes: {
            species: { in: ["Spino", "Para"] },
          },
        },
      };

      const whereClauseSaga: any = {
        holderOwner: { not: null },
        attributes: {
          species: { in: ["Spino", "Para"] },
        },
      };

      if (input.skin && input.skin !== "all") {
        whereClause.attributes = {
          ...whereClause.attributes,
          skin: input.skin,
        };
        whereClauseSaga.attributes = {
          ...whereClauseSaga.attributes,
          skin: input.skin,
        };
      }

      if (input.species && input.species !== "all") {
        if (input.species === "spino" || input.species === "para") {
          whereClauseSaga.attributes = {
            ...whereClauseSaga.attributes,
            species: input.species,
          };
          whereClause.attributes = {
            ...whereClause.attributes,
          };
        } else {
          whereClause.attributes = {
            ...whereClause.attributes,
            species: input.species,
          };
        }
      }

      if (input.color && input.color !== "all") {
        whereClause.attributes = {
          ...whereClause.attributes,
          color: input.color,
        };
        whereClauseSaga.attributes = {
          ...whereClauseSaga.attributes,
          color: input.color,
        };
      }

      if (input.class && input.class !== "all") {
        whereClause.attributes = {
          ...whereClause.attributes,
          class: input.class,
        };
        whereClauseSaga.attributes = {
          ...whereClauseSaga.attributes,
          class: input.class,
        };
      }

      if (input.tribeId && input.tribeId !== "all") {
        whereClause.subdaos = {
          some: {
            id: input.tribeId,
          },
        };
        whereClauseSaga.subdaos = {
          some: {
            id: input.tribeId,
          },
        };
      }

      console.log(whereClause);

      const ogHolders = await ctx.prisma.dino.groupBy({
        by: ["holderOwner"],
        _count: {
          mint: true,
        },
        where: whereClause,
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
        where: whereClauseSaga,
        orderBy: {
          _count: {
            mint: "desc",
          },
        },
      });

      const clayHolders = await ctx.prisma.clay.groupBy({
        by: ["holderOwner"],
        _count: {
          mint: true,
        },
        where: {
          holderOwner: { not: null },
        },
        orderBy: {
          _count: {
            mint: "desc",
          },
        },
      });

      const claymakerHolders = await ctx.prisma.claymaker.groupBy({
        by: ["holderOwner"],
        _count: {
          mint: true,
        },
        where: {
          holderOwner: { not: null },
        },
        orderBy: {
          _count: {
            mint: "desc",
          },
        },
      });

      const combinedHolders: {
        address: string | null;
        og: number;
        saga: number;
        clay: number;
        claymakers: number;
      }[] = [];

      // Combine data based on holderOwner (address)
      ogHolders.forEach((ogHolder) => {
        const matchingSagaHolder = sagaHolders.find(
          (sagaHolder) => sagaHolder.holderOwner === ogHolder.holderOwner
        );
        const matchingClayHolder = clayHolders.find(
          (clayHolder) => clayHolder.holderOwner === ogHolder.holderOwner
        );
        const matchingClaymakerHolder = claymakerHolders.find(
          (claymakerHolder) =>
            claymakerHolder.holderOwner === ogHolder.holderOwner
        );

        combinedHolders.push({
          address: ogHolder.holderOwner,
          og: ogHolder._count.mint,
          saga: matchingSagaHolder ? matchingSagaHolder._count.mint : 0,
          clay: matchingClayHolder ? matchingClayHolder._count.mint : 0,
          claymakers: matchingClaymakerHolder
            ? matchingClaymakerHolder._count.mint
            : 0,
        });
      });

      return combinedHolders.sort((a, b) => b.og - a.og);
    }),

  getDinoHoldersByCount: publicProcedure
    .input(
      z.object({
        skin: z.string(),
        species: z.string(),
        color: z.string(),
        class: z.string(),
        tribeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const holdersWithTribeId = await ctx.prisma.holder.findMany({
        where: {
          subdaos: {
            some: {
              id: input.tribeId,
            },
          },
        },
        select: {
          owner: true,
        },
      });

      console.log(holdersWithTribeId);

      // Extract holderOwner IDs from fetched holders
      const holderOwnerIds = holdersWithTribeId.map((holder) => holder.owner);

      const whereClause: any = {
        holderOwner: {
          in: holderOwnerIds, // Include the fetched holderOwner IDs
        },
        NOT: {
          attributes: {
            species: { in: ["Spino", "Para"] },
          },
        },
      };

      const whereClauseSaga: any = {
        holderOwner: {
          in: holderOwnerIds, // Include the fetched holderOwner IDs
        },
        attributes: {
          species: { in: ["Spino", "Para"] },
        },
      };

      if (input.skin && input.skin !== "all") {
        whereClause.attributes = {
          ...whereClause.attributes,
          skin: input.skin,
        };
        whereClauseSaga.attributes = {
          ...whereClauseSaga.attributes,
          skin: input.skin,
        };
      }

      if (input.species && input.species !== "all") {
        if (input.species === "spino" || input.species === "para") {
          whereClauseSaga.attributes = {
            ...whereClauseSaga.attributes,
            species: input.species,
          };
          whereClause.attributes = {
            ...whereClause.attributes,
          };
        } else {
          whereClause.attributes = {
            ...whereClause.attributes,
            species: input.species,
          };
        }
      }

      if (input.color && input.color !== "all") {
        whereClause.attributes = {
          ...whereClause.attributes,
          color: input.color,
        };
        whereClauseSaga.attributes = {
          ...whereClauseSaga.attributes,
          color: input.color,
        };
      }

      if (input.class && input.class !== "all") {
        whereClause.attributes = {
          ...whereClause.attributes,
          class: input.class,
        };
        whereClauseSaga.attributes = {
          ...whereClauseSaga.attributes,
          class: input.class,
        };
      }

      console.log(whereClause);

      const ogHolders = await ctx.prisma.dino.groupBy({
        by: ["holderOwner"],
        _count: {
          mint: true,
        },
        where: whereClause,
        orderBy: {
          _count: {
            mint: "desc",
          },
        },
      });

      console.log(ogHolders);

      const sagaHolders = await ctx.prisma.dino.groupBy({
        by: ["holderOwner"],
        _count: {
          mint: true,
        },
        where: {
          ...whereClauseSaga,
          holderOwner: {
            in: holderOwnerIds,
          },
        },
        orderBy: {
          _count: {
            mint: "desc",
          },
        },
      });

      const clayHolders = await ctx.prisma.clay.groupBy({
        by: ["holderOwner"],
        _count: {
          mint: true,
        },
        where: {
          holderOwner: { in: holderOwnerIds },
        },
        orderBy: {
          _count: {
            mint: "desc",
          },
        },
      });

      const claymakerHolders = await ctx.prisma.claymaker.groupBy({
        by: ["holderOwner"],
        _count: {
          mint: true,
        },
        where: {
          holderOwner: { in: holderOwnerIds },
        },
        orderBy: {
          _count: {
            mint: "desc",
          },
        },
      });

      const combinedHolders: {
        address: string | null;
        og: number;
        saga: number;
        clay: number;
        claymakers: number;
      }[] = [];

      // Combine data based on holderOwner (address)
      ogHolders.forEach((og) => {
        const matchingSagaHolder = sagaHolders.find(
          (saga) => saga.holderOwner === og.holderOwner
        );
        const matchingClayHolder = clayHolders.find(
          (clay) => clay.holderOwner === og.holderOwner
        );
        const matchingClaymakerHolder = claymakerHolders.find(
          (claymaker) => claymaker.holderOwner === og.holderOwner
        );

        combinedHolders.push({
          address: og.holderOwner,
          og: og._count.mint,
          saga: matchingSagaHolder ? matchingSagaHolder._count.mint : 0,
          clay: matchingClayHolder ? matchingClayHolder._count.mint : 0,
          claymakers: matchingClaymakerHolder
            ? matchingClaymakerHolder._count.mint
            : 0,
        });
      });

      return combinedHolders.sort((a, b) => b.og - a.og);
    }),
});
