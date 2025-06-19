import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import moment from 'moment';

import { env } from '@/env';
import { EmailTemplate } from '@/queue/schemas/email';
import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';
import { ActiveAccountSchema, activeAccountSchema } from '@packages/schemas';

export default async function handler(req: FastifyRequest<{ Body: ActiveAccountSchema }>, reply: FastifyReply) {
  const { token } = req.body;
  const verificationToken = await req.server.prisma.verificationToken.findFirst({
    where: { token, type: "ACTIVE_ACCOUNT" },
    include: { user: true }
  });
  if (!verificationToken) return reply.code(400).send({ message: /*i18n*/("Activation link invalid") });

  if (moment().isAfter(verificationToken.expires)) {
    return req.server.prisma.$transaction(async (tx) => {
      await tx.verificationToken.deleteMany({ where: { userId: verificationToken.userId, type: "ACTIVE_ACCOUNT" } });
      await tx.user.update({ where: { id: verificationToken.userId }, data: { emailVerified: null } });
      const newToken = await tx.verificationToken.create({
        data: {
          userId: verificationToken.userId,
          type: "ACTIVE_ACCOUNT",
          token: crypto.randomUUID(),
          expires: moment().add(req.server.env.ACTIVE_ACCOUNT_TOKEN_EXPIRES, 'ms').toDate()
        }
      });
      await req.server.queue.email.add("", {
        to: verificationToken.user.email!,
        subject: /*i18n*/("Account activation"),
        template: EmailTemplate.ACTIVE_ACCOUNT,
        context: {
          name: verificationToken.user.name!,
          activationUrl: `${req.server.env.FRONTEND_URL}/auth/activate/${newToken.token}`
        }
      });
      return reply.code(400).send({ message: /*i18n*/("Activation link expired") });
    });
  }
  const user = verificationToken.user;

  await req.server.prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
  await req.server.prisma.verificationToken.deleteMany({ where: { userId: user.id, type: "ACTIVE_ACCOUNT" } });
  return { message: /*i18n*/("Account activated") };
}

export const options: RouteShorthandOptions = { 
  schema: {
    body: activeAccountSchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema
    }
  }
};

export const ignore = !env.ALLOW_CREATE_ACCOUNT;