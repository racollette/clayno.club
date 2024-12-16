import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

type CombinedHolder = {
  address: string | null;
  // owner: {
  //   username: string | null;
  //   userHandle: string | null;
  //   userPFP: string | null;
  // };
  og: number;
  saga: number;
  clay: number;
  claymakers: number;
};

type ClayHolder = {
  address: string | null;
  red: number;
  blue: number;
  green: number;
  yellow: number;
  white: number;
  black: number;
  total: number;

  [key: string]: number | string | null;
};

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

  getWalletUser: publicProcedure
    .input(z.object({ walletAddress: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          wallets: {
            some: {
              address: input.walletAddress,
            },
          },
        },
        include: {
          discord: true,
          twitter: true,
          telegram: true,
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
        tribe: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        holderOwner: { not: null },
        // NOT: {
        //   attributes: {
        //     species: { in: ["Spino", "Para"] },
        //   },
        // },
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
            // ...whereClause.attributes,
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

      if (input.tribe && input.tribe !== "all") {
        whereClause.subdaos = {
          some: {
            acronym: input.tribe,
          },
        };
        whereClauseSaga.subdaos = {
          some: {
            acronym: input.tribe,
          },
        };
      }

      const holders = await ctx.prisma.dino.groupBy({
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

      const combinedHolders: CombinedHolder[] = [];
      for (const holder of holders) {
        await fetchUserDetails(
          holder,
          combinedHolders,
          sagaHolders,
          clayHolders,
          claymakerHolders,
          "trait",
          input.species
        );
      }

      return combinedHolders.sort((a, b) => b.og - a.og);
    }),

  getDinoHoldersByCount: publicProcedure
    .input(
      z.object({
        skin: z.string(),
        species: z.string(),
        color: z.string(),
        class: z.string(),
        tribe: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const holdersWithTribeId = await ctx.prisma.holder.findMany({
        where: {
          subdaos: {
            some: {
              acronym: input.tribe,
            },
          },
        },
        select: {
          owner: true,
        },
      });

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
            // ...whereClause.attributes,
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

      const combinedHolders: CombinedHolder[] = [];
      for (const og of ogHolders) {
        await fetchUserDetails(
          og,
          combinedHolders,
          sagaHolders,
          clayHolders,
          claymakerHolders,
          "cc"
        );
      }

      return combinedHolders.sort((a, b) => b.og - a.og);
    }),

  getClayHoldersByColor: publicProcedure
    // .input(
    //   z.object({
    //     color: z.string(),
    //   })
    // )
    .query(async ({ ctx, input }) => {
      const clayColorsByOwner = await ctx.prisma.clay.groupBy({
        by: ["holderOwner", "color"],
        _count: {
          color: true,
        },
        where: {
          holderOwner: { not: null },
        },
      });

      const clayHoldersMap: Record<string, ClayHolder> = {};

      for (const { holderOwner, color, _count } of clayColorsByOwner) {
        if (holderOwner && color) {
          if (!clayHoldersMap[holderOwner]) {
            clayHoldersMap[holderOwner] = {
              address: holderOwner,
              red: 0,
              blue: 0,
              green: 0,
              yellow: 0,
              white: 0,
              black: 0,
              total: 0,
            };
          }

          const clayHolder = clayHoldersMap[holderOwner];
          // Ensure color is a valid key of ClayHolder
          if (clayHolder) {
            clayHolder[color.toLowerCase()] = _count.color;
            clayHolder.total += _count.color;
          }
        }
      }

      const clayHolders: ClayHolder[] = Object.values(clayHoldersMap);

      return clayHolders.sort((a, b) => b.total - a.total);

      // return clayColorsByOwner.sort((a, b) => b._count.color - a._count.color);
    }),
});
async function fetchUserDetails(
  og: any,
  combinedHolders: any,
  sagaHolders: any,
  clayHolders: any,
  claymakerHolders: any,
  type?: string,
  species?: string
) {
  const matchingSagaHolder = sagaHolders.find(
    (sagaHolder: any) => sagaHolder.holderOwner === og.holderOwner
  );
  const matchingClayHolder = clayHolders.find(
    (clayHolder: any) => clayHolder.holderOwner === og.holderOwner
  );
  const matchingClaymakerHolder = claymakerHolders.find(
    (claymakerHolder: any) => claymakerHolder.holderOwner === og.holderOwner
  );

  const isSpecialCase = species === "para" || species === "spino";
  const isAllSpecies = species === "all";

  let ogCount = 0;
  if (type === "cc" || (species && !isAllSpecies && !isSpecialCase)) {
    ogCount = og._count.mint;
  } else if (isAllSpecies) {
    ogCount = og._count.mint - (matchingSagaHolder?._count.mint || 0);
  }

  // if (type === "sec") {
  //   ogCount = 0;
  // }

  combinedHolders.push({
    address: og.holderOwner,
    og: ogCount,
    saga: matchingSagaHolder ? matchingSagaHolder._count.mint : 0,
    clay: matchingClayHolder ? matchingClayHolder._count.mint : 0,
    claymakers: matchingClaymakerHolder
      ? matchingClaymakerHolder._count.mint
      : 0,
  });
}
