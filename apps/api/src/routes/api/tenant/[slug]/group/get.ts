import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import {
  getGroupQueryParamsSchema, GetGroupQueryParamsSchema, getGroupsSchema, TenantSlugParamsSchema,
  tenantSlugParamsSchema
} from '@packages/schemas';

function nullToUndefined(obj: any): any {

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(nullToUndefined);
  } else if (obj && typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : nullToUndefined(v)])
    );
  }
  return obj === null ? undefined : obj;
}

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema, Querystring: GetGroupQueryParamsSchema }>,
  reply: FastifyReply
) {
  const groups = await req.server.prisma.group.findMany({
    where: { 
      tenantId: req.tenant.id,
      path: req.query.path ?? null
    }
  });
  req.log.info(nullToUndefined(groups));
  return reply.status(200).send(nullToUndefined(groups));
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