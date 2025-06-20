import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';

export default async function handler(
  req: FastifyRequest<{ Body: z.infer<typeof bodySchema>}>,
  reply: FastifyReply
) {
  const invite = await req.server.prisma.invite.findUnique({ where: { id: req.body.id } });
  if (!invite || invite.email !== req.session.user.email) 
    return reply.status(404).send({ message: /*i18n*/("Invite not found") });

  await req.server.prisma.$transaction(async (tx) => {
    await tx.member.create({
      data: {
        email: invite.email,
        role: { connect: { id: invite.roleId } },
        tenant: { connect: { id: invite.tenantId } },
        user: { connect: { id: invite.userId } }
      }
    });
    await tx.invite.delete({ where: { id: req.body.id } });
  });
  return reply.status(200).send({ message: /*i18n*/("Invite accepted") });
}


const bodySchema = z.object({ id: z.string() })
export const options: RouteShorthandOptions = {
  schema: {
    body: bodySchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};