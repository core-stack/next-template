import { EmailTemplate } from "@/plugins/queue/email/schema";
import { ActiveAccountSchema, activeAccountSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import moment from "moment";

export default async function handler(req: FastifyRequest<{ Body: ActiveAccountSchema }>, reply: FastifyReply) {
  const { token } = req.body;
  const verificationToken = await req.server.prisma.verificationToken.findFirst({
    where: { token, type: "ACTIVE_ACCOUNT" },
    include: { user: true }
  });
  if (!verificationToken) return reply.code(400).send({ message: "Link de ativação inválido" });

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
        subject: "Ativação de conta",
        template: EmailTemplate.ACTIVE_ACCOUNT,
        context: {
          name: verificationToken.user.name!,
          activationUrl: `${req.server.env.APP_URL}/auth/activate/${newToken.token}`
        }
      });
      return reply.code(400).send({ message: "O link de ativação expirou. Um novo link foi enviado para o seu email." });
    });
  }
  const user = verificationToken.user;

  await req.server.prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
  await req.server.prisma.verificationToken.deleteMany({ where: { userId: user.id, type: "ACTIVE_ACCOUNT" } });
  return { message: "Conta ativada com sucesso" };
}

export const options: RouteShorthandOptions = { schema: { body: activeAccountSchema } };