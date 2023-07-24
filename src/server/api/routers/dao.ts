import { Input } from "postcss";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const daoRouter = createTRPCRouter({
  getSubDAO: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.subDAO.findFirst({
        where: {
          name: input.name,
        },
        include: {
          dinos: {
            orderBy: {
              rarity: "asc",
            },
            include: {
              attributes: true,
            },
          },
        },
      });
    }),
});
