import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res, info }: CreateFastifyContextOptions) {
  return {
    prisma: req.server.prisma,
    jobQueue: req.server.jobQueue,
    auth: req.server.auth,
    req,
    res,
    info
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;