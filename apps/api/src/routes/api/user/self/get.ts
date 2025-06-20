import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { getSelfSchema } from '@packages/schemas';

export default async function handler(req: FastifyRequest, reply: FastifyReply) {
  const user = await req.server.prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      members: { include: { role: true, tenant: { select: { id: true, slug: true } }} }
    },
    where: { id: req.session.user.id },
  });
  if (!user) return reply.status(404).send({ message: "Usuário não encontrado" });
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