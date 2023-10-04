import { z } from "zod";
import { prisma } from "../../db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const generalRouter = createTRPCRouter({
  getLastUpdated: publicProcedure.query(async () => {
    return prisma.lastUpdated.findFirst({
      where: {
        id: "lastUpdated",
      },
    });
  }),
});
