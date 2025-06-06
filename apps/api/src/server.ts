import fastifyCookie from "@fastify/cookie";
import { env } from "@packages/env";
import Fastify from "fastify";

import authPlugin from "./plugins/auth";
import bootstrapPlugin from "./plugins/bootstrap";
import cronPlugin from "./plugins/cron";
import envPlugin from "./plugins/env";
import prismaPlugin from "./plugins/prisma";
import queuePlugin from "./plugins/queue";
import storagePlugin from "./plugins/storage";
import trpcPlugin from "./trpc/adapter";

const app = Fastify({ logger: true });

await app.register(fastifyCookie, { secret: "supersecret", parseOptions: {} });

await app.register(envPlugin);
await app.register(prismaPlugin);
await app.register(queuePlugin);
await app.register(cronPlugin);
await app.register(authPlugin, {
  jwt: {
    secret: env.JWT_SECRET,
    accessTokenDuration: env.JWT_ACCESS_TOKEN_DURATION,
    refreshTokenDuration: env.JWT_REFRESH_TOKEN_DURATION,
  },
  store: { type: "redis", options: { url: env.REDIS_URL } },
  providers: {}
});
await app.register(bootstrapPlugin);
await app.register(storagePlugin, {
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  endpoint: env.AWS_ENDPOINT,
  publicBaseURL: env.AWS_PUBLIC_BUCKET_BASE_URL,
  defaultBucket: env.AWS_BUCKET,
  region: env.AWS_REGION,
});
await app.register(trpcPlugin);

await app.listen({ port: env.API_PORT });