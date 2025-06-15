import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = await req.server.prisma.user.findUnique({ where: { id: req.session.user.id } });
  if (!user) return reply.status(404).send({ message: "Usuário não encontrado" });
  return !!user.password;
}

export const options: RouteShorthandOptions = {
  schema: {
    response: {
      401: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};