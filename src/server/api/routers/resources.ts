import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const resourcesRouter = createTRPCRouter({
  getAllThreads: publicProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.thread.findMany({
        where: {
          categoryId: input.categoryId,
        },
        orderBy: {
          order: "asc",
        },
      });
    }),
});
