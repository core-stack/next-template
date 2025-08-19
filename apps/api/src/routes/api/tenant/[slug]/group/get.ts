import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import {
  getGroupQueryParamsSchema, GetGroupQueryParamsSchema, getGroupsSchema, TenantSlugParamsSchema,
  tenantSlugParamsSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema, Querystring: GetGroupQueryParamsSchema }>,
  reply: FastifyReply
) {
  const groups = await req.server.prisma.group.findMany({
    where: { 
      tenantId: req.tenant.id,
      parentId: req.query.parentId
    }
  });
  return reply.status(200).send(groups);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    querystring: getGroupQueryParamsSchema,
    response: {
      200: getGroupsSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema
    }
  }
};