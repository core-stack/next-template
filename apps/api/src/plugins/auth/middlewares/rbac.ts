import { FastifyReply, FastifyRequest } from 'fastify';

import { can, mergePermissions, numberToPermissions, Permission } from '@packages/permission';

export const rbacMiddleware = (...requiredPermissions: Permission[]) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { session, params } = req;
    req.log.debug('rbacMiddleware', { session, params });
    if (!session) return reply.code(401).send({ error: 'UNAUTHORIZED', message: req.t/*i18n*/("You are not logged in") });

    let permissions = numberToPermissions(session.user.permissions);
    if (params && typeof params === 'object' && 'slug' in params) {
      const rawInput = params;
      const tenant = session.tenants.find(
        (w) => w.slug === (rawInput as { slug: string }).slug
      );

      if (tenant) {
        permissions = mergePermissions(permissions, tenant.permissions);
      } else {
        return reply.code(403).send({ error: 'FORBIDDEN', message: req.t/*i18n*/("You can`t access this tenant") });
      }
    }
    if (!can(permissions, requiredPermissions)) {
      return reply.code(403).send({ error: 'FORBIDDEN', message: req.t/*i18n*/("You don't have permission to access this resource") });
    }
  };
}