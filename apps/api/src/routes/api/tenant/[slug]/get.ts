import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { tenantSlugParams, TenantSlugParams } from '@/schemas/tenant-slug-params';
import { tenantSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParams }>,
  reply: FastifyReply
) {
  const { slug } = req.params;
  const tenant = await req.server.prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return reply.status(404).send({ message: "Tenant not found" });
  return tenant;
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParams,
    response: {
      200: tenantSchema,
      404: errorResponseSchema
    }
  }
};