import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { z } from 'zod';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { UpdateProfileSchema, updateProfileSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: UpdateProfileSchema }>,
  reply: FastifyReply
) {
  const { session } = req;
  await req.server.prisma.user.update({
    where: { id: session.user.id },
    data: { name: req.body.name },
  });
  return reply.status(200).send({ message: /*i18n*/("Name updated") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: updateProfileSchema,
    response: {
      200: z.object({ message: z.string() }),
      401: errorResponseSchema
    }
  }
};