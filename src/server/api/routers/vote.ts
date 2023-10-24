import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const voteRouter = createTRPCRouter({
  getVoterInfo: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.voter.findUnique({
        where: {
          userId: input.userId,
        },
        include: {
          votes: true,
        },
      });
    }),

  castVote: protectedProcedure
    .input(z.object({ userId: z.string(), herdId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingVotes = await ctx.prisma.voter.findUnique({
        where: {
          userId: input.userId,
        },
      });

      const votesAvailable = existingVotes && existingVotes?.votesAvailable > 0;

      if (votesAvailable) {
        return await ctx.prisma.voter.update({
          where: {
            userId: input.userId,
          },
          data: {
            votes: {
              connect: { id: input.herdId },
            },
            votesAvailable: {
              decrement: 1,
            },
            votesCast: {
              increment: 1,
            },
          },
        });
      }
    }),

  removeVote: protectedProcedure
    .input(z.object({ userId: z.string(), herdId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingVotes = await ctx.prisma.voter.findUnique({
        where: {
          userId: input.userId,
        },
      });

      const votesCast = existingVotes && existingVotes?.votesCast > 0;

      if (votesCast) {
        return await ctx.prisma.voter.update({
          where: {
            userId: input.userId,
          },
          data: {
            votes: {
              disconnect: { id: input.herdId },
            },
            votesAvailable: {
              increment: 1,
            },
            votesCast: {
              decrement: 1,
            },
          },
        });
      }
    }),
});
