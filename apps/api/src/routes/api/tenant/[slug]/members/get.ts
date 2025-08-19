import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { getTenantFromSlug } from '@/utils/load-tenant';
import {
  getMembersInTenantSchema, tenantSlugParamsSchema, TenantSlugParamsSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema }>,
  reply: FastifyReply
) {
  const tenant = await getTenantFromSlug(req.server.prisma, req.params.slug);
  if (!tenant) return reply.status(404).send({ message: /*i18n*/("Tenant not found") });

  const members = await req.server.prisma.member.findMany({ where: { tenantId: tenant.id } });
  return reply.status(200).send(members);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    response: {
      200: getMembersInTenantSchema,
      401: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};