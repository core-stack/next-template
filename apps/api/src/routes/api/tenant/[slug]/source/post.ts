import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';
import {
  createSourceSchema, CreateSourceSchema, groupQueryParamsSchema, GroupQueryParamsSchema,
  tenantSlugParamsSchema, TenantSlugParamsSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: CreateSourceSchema, Querystring: GroupQueryParamsSchema, Params: TenantSlugParamsSchema }>,
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
  
  await req.server.prisma.source.createMany({
    data: req.body.map(source => ({
      name: source.name,
      sourceType: source.sourceType,
      url: source.url,
      contentType: source.contentType,
      description: source.description,
      extension: source.extension,
      metadata: source.metadata,
      originalName: source.originalName,
      size: source.size,
      width: source.width,
      height: source.height,
      indexStatus: 'PENDING',
      groupId: group.id,
      createdById: req.tenant.memberId,
    }))
  });
  return reply.status(200).send({ message: /*i18n*/("Source created") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: createSourceSchema,
    params: tenantSlugParamsSchema,
    querystring: groupQueryParamsSchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema
    }
  }
};