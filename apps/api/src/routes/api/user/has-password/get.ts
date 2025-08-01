import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { z } from 'zod';

import { errorResponseSchema } from '@/schemas/error-response.schema';

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = await req.server.prisma.user.findUnique({ where: { id: req.session.user.id } });
  if (!user) return reply.status(404).send({ message: /*i18n*/("User not found") });
  reply.send({ hasPassword: !!user.password});
}

export const options: RouteShorthandOptions = {
  schema: {
    response: {
      200: z.object({ hasPassword: z.boolean() }),
      401: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};