import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';
import {
  updateGroupSchema, UpdateGroupSchema, updateOrDeleteGroupParamsSchema,
  UpdateOrDeleteGroupParamsSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: UpdateOrDeleteGroupParamsSchema, Body: UpdateGroupSchema }>,
  reply: FastifyReply
) {
  const { description, name, parentId, slug } = req.body;
  await req.server.prisma.group.update({
    where: { id: req.params.id },
    data: {
      description,
      name,
      slug,
      parent: parentId ? { connect: { id: parentId } } : undefined,
    }
  });
  return reply.status(200).send({ message: /*i18n*/("Group updated") });
}

export const options: RouteShorthandOptions = {
  schema: {
    params: updateOrDeleteGroupParamsSchema,
    body: updateGroupSchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema
    }
  }
};