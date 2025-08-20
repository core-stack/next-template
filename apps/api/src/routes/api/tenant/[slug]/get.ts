import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { tenantSchema, tenantSlugParamsSchema, TenantSlugParamsSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema }>,
  reply: FastifyReply
) {
  req.log.debug('getTenant');
  const { slug } = req.params;
  const tenant = await req.server.prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return reply.status(404).send({ message: /*i18n*/("Tenant not found") });
  return tenant;
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    response: {
      200: tenantSchema,
      404: errorResponseSchema
    }
  }
};