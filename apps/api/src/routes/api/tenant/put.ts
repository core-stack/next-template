import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';
import { UpdateTenantSchema, updateTenantSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: UpdateTenantSchema }>,
  reply: FastifyReply
) {
  const { id, slug, ...toUpdate } = req.body;
  await req.server.prisma.tenant.update({
    where: { id: req.body.id },
    data: toUpdate,
  });
  return reply.status(200).send({ message: /*i18n*/("Tenant updated successfully") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: updateTenantSchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema
    }
  }
};