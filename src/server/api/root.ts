import { herdRouter } from "~/server/api/routers/herd";
import { createTRPCRouter } from "~/server/api/trpc";
import { bindingRouter } from "./routers/binding";
import { subdaoRouter } from "./routers/subdao";
import { fusionRouter } from "./routers/fusion";
import { generalRouter } from "./routers/general";
import { statsRouter } from "./routers/stats";
import { inventoryRouter } from "./routers/inventory";
import { resourcesRouter } from "./routers/resources";
import { traitRouter } from "./routers/trait";

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
  stats: statsRouter,
  inventory: inventoryRouter,
  resources: resourcesRouter,
  trait: traitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
