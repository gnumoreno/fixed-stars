import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { starsRouter } from "./routers/stars";
import { planetsRouter } from "~/server/api/routers/planets";
import { housesRouter } from "~/server/api/routers/houses";
import { chartRouter } from "./routers/chart";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  stars: starsRouter,
  planets: planetsRouter,
  houses: housesRouter,
  chart: chartRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

