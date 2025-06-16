import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import moment from 'moment';
import z from 'zod';

import { EmailTemplate } from '@/queue/schemas/email';
import { errorResponseSchema } from '@/schemas/error-response.schema';
import { forgetPasswordSchema, ForgetPasswordSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: ForgetPasswordSchema }>,
  reply: FastifyReply
) {
  const { email } = req.body;
  const user = await req.server.prisma.user.findUnique({ where: { email } });
  if (!user) return reply.status(404).send({ message: "Usuário não encontrado" });
  await req.server.prisma.$transaction(async (tx) => {
    const { token } = await tx.verificationToken.create({
      data: {
        expires: moment().add(req.server.env.RESET_PASSWORD_TOKEN_EXPIRES, 'ms').toDate(),
        token: crypto.randomUUID(),
        user: {
          connect: {
            id: user.id
          }
        },
        type: "RESET_PASSWORD",
      }
    })
    await req.server.queue.email.add("", {
      to: email,
      subject: "Recuperação de senha",
      template: EmailTemplate.FORGET_PASSWORD,
      context: {
        name: user.name,
        resetUrl: `${req.server.env.FRONTEND_URL}/auth/reset-password/${token}`
      },
    });
  })
  return reply.status(200).send({ message: "Email enviado com sucesso" });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: forgetPasswordSchema,
    response: {
      200: z.object({ message: z.string() }),
      400: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};