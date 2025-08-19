import { FastifyReply, FastifyRequest } from 'fastify';

export const tenantMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  const { session, params } = req;
  if (!session) return reply.code(401).send({ error: 'UNAUTHORIZED', message: req.t/*i18n*/("You are not logged in") });
  let slug: string | undefined;
  if (params && typeof params === 'object' && 'slug' in params) {
    slug = (params as { slug: string }).slug;
  } else {
    req.log.warn(`Tenant not found, tenant middleware not working in route: ${req.url}`);
    return reply.code(403).send({ error: 'FORBIDDEN', message: req.t/*i18n*/("You can`t access this tenant") });
  }

  const tenant = req.session.tenants.find((tenant) => tenant.slug === slug);
  if (!tenant) {
    return reply.code(403).send({ error: 'FORBIDDEN', message: req.t/*i18n*/("You can`t access this tenant") });
  }

  req.tenant = tenant;
}