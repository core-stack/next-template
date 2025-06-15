import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

import { comparePassword, hashPassword } from '@/plugins/auth/utils';
import { EmailTemplate } from '@/queue/schemas/email';
import { errorResponseSchema } from '@/schemas/error-response.schema';
import { UpdatePasswordSchema, updatePasswordSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: UpdatePasswordSchema }>,
  reply: FastifyReply
) {
  const { session } = req;
  const user = await req.server.prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return reply.status(404).send({ message: "Usuário não encontrado" });

  if (user.password) {
    if (!req.body.currentPassword) return reply.status(400).send({ message: "Senha atual obrigatória" });
    if (!await comparePassword(req.body.currentPassword, user.password)) return reply.status(400).send({ message: "Senha atual incorreta" });
  }

  await req.server.prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: { password: await hashPassword(req.body.newPassword) }
    });
    req.server.queue.email.add("", {
      to: user.email!,
      subject: "Alteração de senha",
      template: EmailTemplate.CHANGE_PASSWORD,
      context: {
        name: user.name,
      },
    })
  });

  return reply.status(200).send({ message: "Senha alterada com sucesso" });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: updatePasswordSchema,
    response: {
      200: z.object({ message: z.string() }),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};