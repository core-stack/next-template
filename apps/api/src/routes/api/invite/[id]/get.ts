import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { getInviteReplySchema, GetInviteSchema, getInviteSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: GetInviteSchema }>,
  reply: FastifyReply
) {
  const { id } = req.params;
  const invite = await req.server.prisma.invite.findUnique({ where: { id }, include: { tenant: true, role: true } });
  if (!invite) return reply.status(404).send({ message: /*i18n*/("Invite not found") });
  return invite;
}

export const options: RouteShorthandOptions = {
  schema: {
    params: getInviteSchema,
    response: {
      200: getInviteReplySchema,
      400: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};