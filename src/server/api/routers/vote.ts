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
    .mutation(({ ctx, input }) => {
      // const existingHerdVoter = ctx.prisma.herdVoter.findFirst({
      //   where: {
      //     herdId: input.herdId,
      //     voterId: input.userId,
      //   },
      // });

      // if (!existingHerdVoter) {
      //   // Create a new entry in the HerdVoter table to link the Voter to the Herd.
      //   ctx.prisma.herdVoter.create({
      //     data: {
      //       herdId: input.herdId,
      //       voterId: input.userId,
      //     },
      //   });
      // }

      return ctx.prisma.voter.update({
        where: {
          userId: input.userId,
        },
        data: {
          votes: {
            connect: { id: input.herdId }, // Connect the "Voter" to the "Herd."
          },
          votesAvailable: {
            decrement: 1,
          },
          votesCast: {
            increment: 1,
          },
        },
      });
    }),

  removeVote: protectedProcedure
    .input(z.object({ userId: z.string(), herdId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.voter.update({
        where: {
          userId: input.userId,
        },
        data: {
          votes: {
            disconnect: { id: input.herdId }, // Connect the "Voter" to the "Herd."
          },
          votesAvailable: {
            increment: 1,
          },
          votesCast: {
            decrement: 1,
          },
        },
      });
    }),
});
