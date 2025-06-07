import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res, info }: CreateFastifyContextOptions) {
  return {
    prisma: req.server.prisma,
    queue: req.server.queue,
    auth: req.server.auth,
    req,
    res,
    info
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;