import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import {
  getGroupsSchema, GroupQueryParamsSchema, groupQueryParamsSchema, TenantSlugParamsSchema,
  tenantSlugParamsSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema, Querystring: GroupQueryParamsSchema }>,
  reply: FastifyReply
) {
  const groups = await req.server.prisma.group.findMany({
    where: { 
      tenantId: req.tenant.id,
      path: req.query.path ?? null
    }
  });
  return reply.status(200).send(groups);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    querystring: groupQueryParamsSchema,
    response: {
      200: getGroupsSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema
    }
  }
};