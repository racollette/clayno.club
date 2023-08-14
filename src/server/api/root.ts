import { herdRouter } from "~/server/api/routers/herd";
import { createTRPCRouter } from "~/server/api/trpc";
import { bindingRouter } from "./routers/binding";
import { subdaoRouter } from "./routers/subdao";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  herd: herdRouter,
  binding: bindingRouter,
  subdao: subdaoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
