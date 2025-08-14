import { FastifyReply, FastifyRequest } from 'fastify';

export const tenantMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  const { session, params } = req;
  req.log.info('tenantMiddleware', { session, params });
  if (!session) return reply.code(401).send({ error: 'UNAUTHORIZED', message: req.t/*i18n*/("You are not logged in") });
  let slug: string | undefined;
  if (params && typeof params === 'object' && 'slug' in params) {
    slug = (params as { slug: string }).slug;
  } else {
    req.log.warn(`Tenant not found, tenant middleware not working in route: ${req.url}`);
    return reply.code(403).send({ error: 'FORBIDDEN', message: req.t/*i18n*/("You can`t access this tenant") });
  }

  const canAccess = req.session.tenants.some((tenant) => tenant.slug === slug);
  if (!canAccess) {
    return reply.code(403).send({ error: 'FORBIDDEN', message: req.t/*i18n*/("You can`t access this tenant") });
  }
}