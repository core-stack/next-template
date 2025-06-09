import fastGlob from "fast-glob";
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import fp from "fastify-plugin";
import path from "path";

const HTTP_METHODS = ["get", "post", "put", "delete", "patch", "all"] as const;
type HttpMethod = typeof HTTP_METHODS[number];

// Convert [id] to :id and [...slug] to *
function segmentToRoute(seg: string): string {
  if (seg.startsWith("[...") && seg.endsWith("]")) return "*";
  if (seg.startsWith("[") && seg.endsWith("]")) return `:${seg.slice(1, -1)}`;
  return seg;
}

// Join segments to build route
function buildRouteFromPath(fullPath: string, baseDir: string): string {
  const relative = path.relative(baseDir, fullPath);
  const segments = relative.split(path.sep).slice(0, -1); // remove file (ex: get.ts)
  const routeSegments = segments.map(segmentToRoute);
  return "/" + routeSegments.filter(Boolean).join("/");
}

// Try to find middleware.ts in the folder
async function findMiddleware(dir: string): Promise<((req: FastifyRequest, reply: FastifyReply) => Promise<void>) | null> {
  try {
    const mod = await import(path.resolve(dir, "middleware.ts"));
    const middlewareFn = mod.default;
    if (typeof middlewareFn === "function") {
      return async (req, reply) => {
        await middlewareFn(req.server, req, reply);
      };
    }
  } catch {
    // not found, ignore
  }
  return null;
}

// Loader
export async function registerRoutes(
  app: FastifyInstance,
  { baseDir = path.resolve("src/routers"), logLevel }: Options
) {
  const logger = app.log.child({ plugin: 'ROUTER' });

  const files = await fastGlob(
    HTTP_METHODS.map((method) => `**/${method}.ts`),
    { cwd: baseDir, absolute: true }
  );

  for (const file of files) {
    const parsed = path.parse(file);
    const method = parsed.name as HttpMethod;
    const routePath = buildRouteFromPath(file, baseDir!);
    const mod = await import(file);

    if (!mod.default) {
      logger.error(`Route ${routePath} has no default export`);
      continue;
    }

    const handler = mod.default;
    const options: RouteShorthandOptions = mod.options || {};
    const ignore = mod.ignore || false;
    if (ignore) {
      logger.warn(`Route ${routePath} is ignored`);
      continue;
    }
    const middleware = await findMiddleware(parsed.dir);

    const middlewares: any[] = [];
    if (middleware) middlewares.push(middleware);
    if (mod.middlewares) middlewares
      .push(...mod.middlewares.map((m: any) => async (req: FastifyRequest, reply: FastifyReply) => m(req.server, req, reply)));

    if (options.preHandler) {
      const existing = Array.isArray(options.preHandler) ? options.preHandler : [options.preHandler];
      middlewares.push(...existing);
    }

    app.route({
      method: method.toUpperCase(),
      url: routePath === "" ? "/" : routePath,
      handler,
      logLevel: logLevel,
      preHandler: middlewares.length ? middlewares : undefined,
      ...options,
    });

    logger.info(`[${method.toUpperCase()}] ${routePath} registered successfully`);
  }
}

type Options = {
  baseDir?: string
  logLevel?: "info" | "warn" | "error" | "silent" | "debug" | "trace"
};

export default fp(async (app, opts: Options) => {
  const logger = app.log.child({ plugin: 'ROUTER' });

  logger.info("Registering path-register plugin");
  await registerRoutes(app, opts);
  logger.info("Path-register plugin registered successfully");
});
