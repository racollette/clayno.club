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
});
