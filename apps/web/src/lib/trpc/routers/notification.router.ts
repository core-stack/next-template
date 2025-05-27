import { preNotificationSchema, prisma } from "@packages/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  deleteSchema, markAllAsReadSchema, markAsReadSchema, syncSchema
} from "../schema/notification.schema";
import { protectedProcedure, router } from "../trpc";

const findMemberAndThrowIfNotExists = async (userId: string, slug: string) => {
  const member = await prisma.member.findFirst({
    where: { userId, workspace: { slug } },
  });
  if (!member) throw new TRPCError({ code: 'NOT_FOUND', message: 'Membro não encontrado' });
  return member;
};

export const notificationRouter = router({
  sync: protectedProcedure
    .input(syncSchema)
    .mutation(async ({ ctx, input }) => {
      const member = await findMemberAndThrowIfNotExists(ctx.session.user.id, input.slug);
      if (member.fcmToken !== input.token) {
        await prisma.member.update({ where: { id: member.id }, data: { fcmToken: input.token } });
      }
    }),
  getNotifications: protectedProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .output(preNotificationSchema.array())
    .query(async ({ ctx, input }) => {
      const member = await findMemberAndThrowIfNotExists(ctx.session.user.id, input.slug);
      const notifications = await prisma.notification.findMany({
        where: { destinationId: member.id },
        include: { createdBy: { include: { user: true } }, destination: { include: { user: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return notifications.map(notification => ({
        ...notification,
        createdAt: new Date(notification.createdAt),
        readAt: notification.readAt ? new Date(notification.readAt) : null,
      }));
    }),
  markAsRead: protectedProcedure
    .input(markAsReadSchema)
    .mutation(async ({ input, ctx }) => {
      await findMemberAndThrowIfNotExists(ctx.session.user.id, input.slug);
      await prisma.notification.update({ where: { id: input.id }, data: { read: true } });
    }),
  markAllAsRead: protectedProcedure
    .input(markAllAsReadSchema)
    .mutation(async ({ ctx, input }) => {
      const member = await findMemberAndThrowIfNotExists(ctx.session.user.id, input.slug);
      await prisma.notification
        .updateMany({ where: { destinationId: member.id }, data: { read: true } });
    }),
  delete: protectedProcedure
    .input(deleteSchema)
    .mutation(async ({ input, ctx }) => {
      await findMemberAndThrowIfNotExists(ctx.session.user.id, input.slug);
      await prisma.notification.delete({ where: { id: input.id } });
    }),
});