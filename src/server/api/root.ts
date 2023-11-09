import { herdRouter } from "~/server/api/routers/herd";
import { createTRPCRouter } from "~/server/api/trpc";
import { bindingRouter } from "./routers/binding";
import { subdaoRouter } from "./routers/subdao";
import { fusionRouter } from "./routers/fusion";
import { generalRouter } from "./routers/general";
import { voteRouter } from "./routers/vote";
import { statsRouter } from "./routers/stats";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  herd: herdRouter,
  binding: bindingRouter,
  subdao: subdaoRouter,
  fusion: fusionRouter,
  general: generalRouter,
  vote: voteRouter,
  stats: statsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
