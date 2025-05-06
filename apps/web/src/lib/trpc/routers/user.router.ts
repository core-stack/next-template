import { comparePassword, hashPassword } from "@/lib/authz";
import { getPresignedUrl } from "@/lib/upload";
import { prisma } from "@packages/prisma";
import { addInQueue, EmailTemplate, QueueName } from "@packages/queue";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  selfUserSchema, updatePasswordSchema, updateProfileSchema, updateUserPictureSchema
} from "../schema/user";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  self: protectedProcedure
    .output(selfUserSchema)
    .query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        members: { include: { workspace: { select: { id: true, slug: true } }} }
      },
      where: { id: ctx.session.user.id },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
    return user;
  }),
  hasPassword: protectedProcedure
    .output(z.boolean())
    .query(async ({ ctx }) => {
      const user = await prisma.user.findUnique({ where: { id: ctx.session.user.id } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
      return !!user.password;
    }),
  updatePassword: protectedProcedure
    .input(updatePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
      if (user.password) {
        if (!input.currentPassword)
          throw new TRPCError({ code: "FORBIDDEN", message: "Por favor, informe sua senha atual" });
        if (!await comparePassword(input.currentPassword, user.password))
          throw new TRPCError({ code: "FORBIDDEN", message: "Senha incorreta" });
      }
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: await hashPassword(input.newPassword) }
      });
      await addInQueue(
        QueueName.EMAIL,
        {
          to: user.email!,
          template: EmailTemplate.CHANGE_PASSWORD,
          subject: "Alteração de senha",
          context: {
            name: user.name,
          },
        }
      )
    }),
  updateName: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: input.name },
      });
    }),

  updateImage: protectedProcedure
    .input(updateUserPictureSchema)
    .mutation(async ({ input, ctx }) => {
      return await getPresignedUrl(input.fileName, input.contentType);
    })
});