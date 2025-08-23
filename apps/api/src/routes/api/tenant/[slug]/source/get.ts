import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import {
  getSourcesSchema, groupQueryParamsSchema, GroupQueryParamsSchema, tenantSlugParamsSchema,
  TenantSlugParamsSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema, Querystring: GroupQueryParamsSchema }>,
  reply: FastifyReply
) {
  const slug = req.query.path?.split('/').at(-1);
  const group = await req.server.prisma.group.findUnique({
    where: {
      slug_tenantId: {
        tenantId: req.tenant.id,
        slug
      }
    }
  });
  if (!group) return reply.status(400).send({ message: /*i18n*/("Group not found") });
  const sources = await req.server.prisma.source.findMany({ where: { groupId: group.id } });
  return reply.status(200).send(sources);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    querystring: groupQueryParamsSchema,
    response: {
      200: getSourcesSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
    }
  }
};