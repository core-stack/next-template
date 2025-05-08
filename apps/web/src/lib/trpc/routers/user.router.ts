import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import { comparePassword, hashPassword } from '@/lib/authz';
import { prisma } from '@packages/prisma';
import { addInQueue, EmailTemplate, QueueName } from '@packages/queue';
import { buildPublicUrl, getPreSignedUploadUrl } from '@packages/storage';
import { TRPCError } from '@trpc/server';

import {
  confirmUploadProfileImageSchema, selfUserSchema, updatePasswordSchema, updateProfileSchema,
  updateUserPictureSchema
} from '../schema/user';
import { protectedProcedure, router } from '../trpc';

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
      console.log(input);

      if (user.password) {
        if (!input.currentPassword)
          throw new TRPCError({ code: "BAD_REQUEST", message: "Por favor, informe sua senha atual" });
        if (!await comparePassword(input.currentPassword, user.password))
          throw new TRPCError({ code: "BAD_REQUEST", message: "Senha incorreta" });
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
      return { name: input.name };
    }),
  getUpdateImagePresignedUrl: protectedProcedure
    .input(updateUserPictureSchema)
    .mutation(async ({ input }) => {
      const key = `user-profile/${randomUUID()}.${input.fileName.split(".").pop()}`;
      const url = await getPreSignedUploadUrl(key, input.contentType, true);
      return { url, key, publicUrl: buildPublicUrl(key) };
    }),
  confirmUpload: protectedProcedure
    .input(confirmUploadProfileImageSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const { key } = input;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: buildPublicUrl(key) },
      });
      await addInQueue(
        QueueName.COMPRESS_IMAGE,
        {
          key: key,
          height: 200,
          width: 200
        }
      )
    }),
});