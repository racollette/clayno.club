import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const voteRouter = createTRPCRouter({
  createVoter: protectedProcedure
    .input(z.object({ userId: z.string(), wallets: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // Create a new user in the database
      try {
        const checkHolderStatus = await ctx.prisma.holder.findFirst({
          where: {
            owner: {
              in: input.wallets,
            },
          },
        });

        const dinosOwned = checkHolderStatus?.amount || 0;
        const votesToIssue = dinosOwned > 0 ? 20 : 0;
        const createdVoter = await ctx.prisma.voter.create({
          data: {
            votesAvailable: votesToIssue,
            votesCast: 0,
            userId: input.userId,
            votesIssued: votesToIssue > 0,
          },
        });
        return createdVoter;
      } catch (error) {
        throw new Error("Failed to create voter");
      }

      // return userResponseSchema.parse(createdUser);
    }),

  issueVotes: protectedProcedure
    .input(z.object({ userId: z.string(), wallets: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // Create a new user in the database
      try {
        const checkHolderStatus = await ctx.prisma.holder.findFirst({
          where: {
            owner: {
              in: input.wallets,
            },
          },
        });

        const dinosOwned = checkHolderStatus?.amount || 0;
        const votesToIssue = dinosOwned > 0 ? 20 : 0;
        const issueVotes = await ctx.prisma.voter.update({
          where: {
            userId: input.userId,
          },
          data: {
            votesAvailable: votesToIssue,
            votesIssued: votesToIssue > 0,
          },
        });
        return issueVotes;
      } catch (error) {
        throw new Error("Failed to issue votes");
      }

      // return userResponseSchema.parse(createdUser);
    }),

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
