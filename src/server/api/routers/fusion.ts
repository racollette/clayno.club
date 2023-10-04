import { z } from "zod";
import { prisma } from "../../db";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const createUserRequestSchema = z.object({
  address: z.string(),
});

const createUserCollageSchema = z.object({
  userId: z.string(),
  columns: z.number(),
  rows: z.number(),
  borderWidth: z.number(),
  borderColor: z.string(),
  data: z.array(
    z.array(
      z.object({
        mint: z.string(),
        motion: z.string(),
        imageURL: z.string(),
      })
    )
  ),
});

export const fusionRouter = createTRPCRouter({
  getUserDinos: protectedProcedure
    .input(
      z.object({
        wallets: z.array(z.string()),
      })
    )
    .query(async ({ input }) => {
      return prisma.holder.findMany({
        where: {
          owner: {
            in: input.wallets,
          },
        },
        include: {
          mints: {
            orderBy: {
              rarity: "asc",
            },
            include: {
              attributes: true,
            },
          },
        },
        // select: {
        //   id: true,
        //   defaultAddress: true,
        //   wallets: true,
        //   discord: true,
        //   twitter: true,
        // },
      });
    }),

  getUserCollages: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return prisma.collage.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),

  getPublicCollages: publicProcedure
    .input(z.object({ userId: z.string(), isOwner: z.boolean() }))
    .query(async ({ input }) => {
      if (input.isOwner) {
        return prisma.collage.findMany({
          where: {
            userId: input.userId,
          },
        });
      }

      return prisma.collage.findMany({
        where: {
          userId: input.userId,
          hidden: false,
        },
      });
    }),

  saveCollage: protectedProcedure
    .input(createUserCollageSchema)
    .mutation(async ({ input }) => {
      // Create a new collage in the database
      const savedCollage = await prisma.collage.create({
        data: {
          userId: input.userId,
          columns: input.columns,
          rows: input.rows,
          borderWidth: input.borderWidth,
          borderColor: input.borderColor,
          data: input.data,
          status: "new",
          hidden: false,
        },
      });

      return savedCollage;
    }),

  deleteCollage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const deletedCollage = await prisma.collage.delete({
        where: {
          id: input.id,
        },
      });

      return deletedCollage;
    }),

  hideCollage: protectedProcedure
    .input(z.object({ id: z.string(), hidden: z.boolean() }))
    .mutation(async ({ input }) => {
      const hideCollage = await prisma.collage.update({
        where: {
          id: input.id,
        },
        data: {
          hidden: input.hidden,
        },
      });

      return hideCollage;
    }),
});
