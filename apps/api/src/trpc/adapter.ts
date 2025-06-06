import { AppRouter, appRouter } from "@/routers";
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import fp from "fastify-plugin";

import { createContext } from "./context";

export default fp(async (app) => {
  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });
});