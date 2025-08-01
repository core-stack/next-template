import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

import { hashPassword } from '@/plugins/auth/utils';
import { errorResponseSchema } from '@/schemas/error-response.schema';
import { ResetPasswordSchema, resetPasswordSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: ResetPasswordSchema }>,
  reply: FastifyReply
) {
  const { token, password } = req.body;
  const verificationToken = await req.server.prisma.verificationToken.findUnique({ where: { token }, include: { user: true } });
  if (!verificationToken?.user) return reply.status(404).send({ message: /*i18n*/("User not found") });
  await req.server.prisma.user.update({
    where: { id: verificationToken.user.id },
    data: { password: await hashPassword(password) }
  });
  
  return reply.status(200).send({ message: /*i18n*/("Password updated") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: resetPasswordSchema,
    response: {
      200: z.object({ message: z.string() }),
      400: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};