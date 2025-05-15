import moment from "moment";
import { cookies } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { comparePassword, hashPassword } from "@/lib/authz";
import { env } from "@packages/env";
import { prisma } from "@packages/prisma";
import { addInQueue, EmailTemplate, QueueName } from "@packages/queue";
import { TRPCError } from "@trpc/server";

import { createAccountSchema, loginSchema } from "../schema/auth";
import { publicProcedure, router } from "../trpc";

const sendActiveAccountEmail = async (to: string, name: string | null, token: string) => {
  const data = {
    to,
    subject: "Ative sua conta",
    template: EmailTemplate.ACTIVE_ACCOUNT,
    context: {
      activationUrl: `${env.APP_URL}/auth/activate/${token}`,
      name,
    }
  } as const
  console.log("Sending active account email");
  console.log(data);
  await addInQueue(QueueName.EMAIL, data);
};

export const authRouter = router({
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input }) => {
      const { email, password, redirect } = input
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          members: { include: { workspace: { select: { id: true, slug: true } } } }
        }
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email ou senha incorretos"
        });
      }
      if (!user.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email ou senha incorretos"
        });
      }
      const valid = await comparePassword(password, user.password);
      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email ou senha incorretos"
        });
      }
      const { token } = await auth.createSessionAndTokens(user);
      const cookie = await cookies();
      cookie.set("access-token", token.accessToken, { maxAge: token.accessTokenDuration });
      cookie.set("refresh-token", token.refreshToken, { maxAge: token.refreshTokenDuration });
      return { redirect: redirect || cookie.get("default-workspace")?.value || "/w" };
    }),

  createAccount: publicProcedure
    .input(createAccountSchema)
    .mutation(async ({ input }) => {
      const { email, password, name } = input
      // verify email in use
      const userWithEmail = await prisma.user.findUnique({ where: { email: email } });
      if (userWithEmail) throw new TRPCError({ code: "BAD_REQUEST", message: "Email já em uso" });

      // hash password
      const hashedPassword = await hashPassword(password);
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email, name, password: hashedPassword,
            verificationToken: {
              create: {
                expires: moment().add(env.ACTIVE_ACCOUNT_TOKEN_EXPIRES, 'ms').toDate(),
                type: "ACTIVE_ACCOUNT",
                token: crypto.randomUUID()
              }
            }
          },
          include: { verificationToken: true }
        });

        await sendActiveAccountEmail(
          user.email!,
          user.name!,
          user.verificationToken.find(token => token.type === "ACTIVE_ACCOUNT")?.token!
        );
      });
    }),

  activateAccount: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const { token } = input;
      const verificationToken = await prisma.verificationToken.findFirst({
        where: { token, type: "ACTIVE_ACCOUNT" },
        include: { user: true }
      });
      if (!verificationToken) throw new TRPCError({ code: "BAD_REQUEST", message: "Token de ativação inválido" });
      if (verificationToken.expires < new Date()) {
        await prisma.verificationToken.deleteMany({ where: { userId: verificationToken.userId, type: "ACTIVE_ACCOUNT" } });
        await prisma.user.update({ where: { id: verificationToken.userId }, data: { emailVerified: null } });
        const newToken = await prisma.verificationToken.create({
          data: {
            userId: verificationToken.userId,
            type: "ACTIVE_ACCOUNT",
            token: crypto.randomUUID(),
            expires: moment().add(env.ACTIVE_ACCOUNT_TOKEN_EXPIRES, 'ms').toDate()
          }
        });
        await sendActiveAccountEmail(
          verificationToken.user.email!,
          verificationToken.user.name!,
          newToken.token
        );
        console.log("O link de ativação expirou. Um novo link foi enviado para o seu email.");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "O link de ativação expirou. Um novo link foi enviado para o seu email."
        });
      }
      const user = verificationToken.user;
      console.log(user);

      await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
      await prisma.verificationToken.deleteMany({ where: { userId: user.id, type: "ACTIVE_ACCOUNT" } });
    }),

  logout: publicProcedure.mutation(async () => {
    const cookie = await cookies();
    cookie.delete("access-token");
    cookie.delete("refresh-token");
    return { redirect: "/auth/login" };
  }),
})