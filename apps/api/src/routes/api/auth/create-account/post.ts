import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import moment from 'moment';
import z from 'zod';

import { env } from '@/env';
import { hashPassword } from '@/plugins/auth/utils';
import { EmailTemplate } from '@/queue/schemas/email';
import { ROLES } from '@packages/permission';
import { CreateAccountSchema, createAccountSchema } from '@packages/schemas';

export default async function handler(req:FastifyRequest<{ Body: CreateAccountSchema }>, reply: FastifyReply) {
  const { email, password, name } = req.body;
  // verify email in use
  const userWithEmail = await req.server.prisma.user.findUnique({ where: { email: email } });
  if (userWithEmail) return reply.status(400).send({ message: "Email já em uso" });

  // hash password
  const hashedPassword = await hashPassword(password);
  await req.server.prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email, name, password: hashedPassword,
        role: {
          connect: {
            key_scope: { key: ROLES.global.user.key, scope: "GLOBAL" }
          }
        },
        verificationToken: {
          create: {
            expires: moment().add(req.server.env.ACTIVE_ACCOUNT_TOKEN_EXPIRES, 'ms').toDate(),
            type: "ACTIVE_ACCOUNT",
            token: crypto.randomUUID()
          }
        }
      },
      include: { verificationToken: true },
    });

    const token = user.verificationToken.find(token => token.type === "ACTIVE_ACCOUNT")?.token;
    await req.server.queue.email.add("", {
      to: user.email!,
      subject: "Ative sua conta",
      template: EmailTemplate.ACTIVE_ACCOUNT,
      context: {
        activationUrl: `${req.server.env.FRONTEND_URL}/auth/activate/${token}`,
        name,
      }
    });

    return reply.status(201).send({});
  });
}
const successSchema = z.object({
  message: z.string(),
  status: z.number(),
});
export const options: RouteShorthandOptions = {
  schema: {
    body: createAccountSchema,
    response: {
      201: successSchema,
      400: z.object({ message: z.string() })
    }
  }
}

export const ignore = !env.ALLOW_CREATE_ACCOUNT;