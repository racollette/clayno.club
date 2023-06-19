import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),

  getT1Herds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.herd.findMany({
      where: {
        tier: 1,
      },
      include: {
        herd: true,
      },
    });
  }),

  getT2Herds: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.herd.findMany({
      where: {
        tier: 2,
      },
      include: {
        herd: true,
      },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
