import { hashPassword } from "@/plugins/auth/utils";
import { EmailTemplate } from "@/plugins/queue/email/schema";
import { ROLES } from "@packages/permission";
import { CreateAccountSchema, createAccountSchema, errorSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import moment from "moment";

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
        activationUrl: `${req.server.env.APP_URL}/auth/activate/${token}`,
        name,
      }
    });

    return reply.status(201).send({});
  });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: createAccountSchema,
    response: {
      400: errorSchema,
      201: {},
    }
  }
}