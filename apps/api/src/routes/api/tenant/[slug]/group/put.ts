import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';
import {
  tenantSlugParamsSchema, TenantSlugParamsSchema, updateGroupSchema, UpdateGroupSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema, Body: UpdateGroupSchema }>,
  reply: FastifyReply
) {
  const { description, name, slug, id } = req.body;
  await req.server.prisma.group.update({
    where: { id },
    data: {
      description,
      name,
      slug,
    }
  });
  return reply.status(200).send({ message: /*i18n*/("Group updated") });
}
export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    body: updateGroupSchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema
    }
  }
};