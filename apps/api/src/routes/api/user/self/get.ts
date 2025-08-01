import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { getSelfSchema } from '@packages/schemas';

export default async function handler(req: FastifyRequest, reply: FastifyReply) {
  const user = await req.server.prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      members: { include: { role: true, tenant: { select: { id: true, slug: true } }} }
    },
    where: { id: req.session.user.id },
  });
  if (!user) return reply.status(404).send({ message: /*i18n*/("User not found") });

  return user; 
}

export const options: RouteShorthandOptions = {
  schema: {
    response: {
      200: getSelfSchema,
      401: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};