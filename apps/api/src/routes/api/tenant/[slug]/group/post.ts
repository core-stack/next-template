import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';
import {
  CreateGroupSchema, createGroupSchema, TenantSlugParamsSchema, tenantSlugParamsSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema, Body: CreateGroupSchema }>,
  reply: FastifyReply
) {
  const { description, name, parentId, slug } = req.body;
  await req.server.prisma.group.create({
    data: {
      description,
      name,
      slug,
      parent: parentId ? { connect: { id: parentId } } : undefined,
      tenant: { connect: { id: req.tenant.id } },
      createdBy: { connect: { id: req.tenant.memberId } },
      GroupAccess: {
        create: {
          member: { connect: { id: req.tenant.memberId } },
        }
      }
    }
  });
  return reply.status(200).send({ message: /*i18n*/("Group created") });
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    body: createGroupSchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema
    }
  }
};