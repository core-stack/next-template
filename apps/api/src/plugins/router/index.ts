import fastGlob from 'fast-glob';
import { FastifyInstance, preHandlerHookHandler } from 'fastify';
import fp from 'fastify-plugin';
import path from 'path';

const HTTP_METHODS = ["get", "post", "put", "delete", "patch", "all"] as const;
type HttpMethod = typeof HTTP_METHODS[number];
export type Middleware = preHandlerHookHandler; // Use Fastify's type for middleware


const isProd = process.env.NODE_ENV === 'production';
const baseDir = path.resolve(isProd ? 'dist/routes' : 'src/routes');
const ext = isProd ? 'js' : 'ts';
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
async function findMiddlewares(app: FastifyInstance, routeDir: string, baseDir: string): Promise<Middleware[]> {
  const middlewares: Middleware[] = [];
  let currentDir = routeDir;

  // Traverse parent directories until reaching baseDir
  while (currentDir.startsWith(baseDir)) {
    const middlewarePath = path.join(currentDir, `middleware.${ext}`);
    
    try {
      // Dynamic import with absolute path
      const mod = await import(middlewarePath);
      if (typeof mod.default === 'function') {
        middlewares.push(mod.default);
      } 
      if (Array.isArray(mod.default)) {
        if (mod.default.length === 0) continue;
        if (mod.default.some(m => typeof m !== 'function')) {
          app.log.warn(`Middleware ${middlewarePath} is not a valid function`);
        }
        middlewares.push(...mod.default);
      }
    } catch (error) {
      // Middleware file not found, continue searching
    }

    // Move to the parent directory
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break; // Prevent infinite loop
    currentDir = parentDir;
  }

  return middlewares.reverse();
}

// Loader
export async function registerRoutes(app: FastifyInstance) {
  const logger = app.log.child({ plugin: 'ROUTER' });

  const files = await fastGlob(
    HTTP_METHODS.map((method) => `**/${method}.${ext}`),
    { cwd: baseDir, absolute: true }
  );
  const registeredRoutes: { path: string, middlewares: string[], method: HttpMethod }[] = [];
  for (const file of files) {
    const parsed = path.parse(file);
    const method = parsed.name as HttpMethod;
    const routePath = buildRouteFromPath(file, baseDir);
    const { default: handler, options = {}, ignore, middlewares: modMiddlewares } = await import(file);

    const routeName = `[${method.toUpperCase()}] ${routePath}`;
    if (ignore) {
      logger.warn(`${routeName} is ignored`);
      continue;
    }

    if (typeof handler !== "function") {
      logger.error(`${routeName} is not a valid function`);
      continue;
    }
    const middlewares = await findMiddlewares(app, parsed.dir, baseDir);

    if (modMiddlewares) middlewares.push(...(modMiddlewares as Middleware[]));
    
    if (options.preHandler) {
      const existing = Array.isArray(options.preHandler) ? options.preHandler : [options.preHandler];
      middlewares.push(...existing);
    }

    app.route({
      method: method.toUpperCase(),
      url: routePath === "" ? "/" : routePath,
      handler,
      preHandler: middlewares.length > 0 ? middlewares : undefined,
      ...options,
    });
    registeredRoutes.push({
      method,
      path: routePath,
      middlewares: middlewares.map((m) => m.name || 'anonymous')
    });
  }
  registeredRoutes
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach((r) => logger.info(`[${r.method.toUpperCase()}] ${r.middlewares.length ? `(${r.middlewares})` : ""} ${r.path}`));
  
}


export default fp(async (app) => {
  await registerRoutes(app);
});