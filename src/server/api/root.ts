import { herdRouter } from "~/server/api/routers/herd";
import { createTRPCRouter } from "~/server/api/trpc";
import { bindingRouter } from "./routers/binding";
import { subdaoRouter } from "./routers/subdao";
import { fuserRouter } from "./routers/fuser";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  herd: herdRouter,
  binding: bindingRouter,
  subdao: subdaoRouter,
  fuser: fuserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
