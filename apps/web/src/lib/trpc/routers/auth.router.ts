import { auth } from "@/lib/auth";
import { comparePassword, hashPassword } from "@/lib/authz";
import { prisma } from "@packages/prisma";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

import { createAccountSchema, loginSchema } from "../schema/auth";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input }) => {
      const { email, password, redirect } = input
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          members: { include: { workspace: { select: { id: true, slug: true } }} }
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
      const userWithEmail = await prisma.user.findUnique({where: { email: email }});
      if (userWithEmail) throw new TRPCError({ code: "BAD_REQUEST", message: "Email já em uso" });

      // hash password
      const hashedPassword = await hashPassword(password);

      // create user
      const user = await prisma.user.create({
        data: {
          email, name, password: hashedPassword,
          verificationToken: {
            create: {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
              type: "ACTIVE_ACCOUNT"
            }
          }
        },
        include: { members: { include: { workspace: { select: { id: true, slug: true } }} } }
      });
      const { token } = await auth.createSessionAndTokens(user);
      const cookie = await cookies();
      cookie.set("access-token", token.accessToken, { maxAge: token.accessTokenDuration });
      cookie.set("refresh-token", token.refreshToken, { maxAge: token.refreshTokenDuration });
      return { redirect: "/w" };
    }),

  logout: publicProcedure.mutation(async () => {
    const cookie = await cookies();
    cookie.delete("access-token");
    cookie.delete("refresh-token");
    return { redirect: "/auth/login" };
  }),
})