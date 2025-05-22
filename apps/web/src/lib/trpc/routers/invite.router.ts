import { env } from "@/env";
import { hasAccess } from "@/lib/utils";
import { Permission } from "@packages/permission";
import { prisma } from "@packages/prisma";
import { addInQueue, EmailTemplate, QueueName } from "@packages/queue";
import { TRPCError } from "@trpc/server";
import moment from "moment";

import {
  deleteInviteSchema, getInviteByWorkspaceSchema, getInviteSchema, inviteMemberSchema,
  inviteWithWorkspaceSchema
} from "../schema/invite.schema";
import { protectedProcedure, rbacProcedure, router } from "../trpc";

export const inviteRouter = router({
  getByIdWithWorkspace: protectedProcedure
    .input(getInviteSchema)
    .output(inviteWithWorkspaceSchema)
    .query(async ({ input, ctx }) => {
      const invite = await prisma.invite.findUnique({ where: { id: input.id }, include: { workspace: true } });
      if (!invite) throw new TRPCError({ code: 'NOT_FOUND', message: "Convite não encontrado" });
      if (invite.email !== ctx.session.user.email)
        throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse convite" });
      return invite;
    }),

  getByWorkspace: protectedProcedure
    .input(getInviteByWorkspaceSchema)
    .query(async ({ input }) => {
      const invites = await prisma.invite.findMany({
        where: { workspace: { slug: input.slug, disabledAt: null } },
      });
      return invites;
    }),

  invite: rbacProcedure([Permission.CREATE_INVITE])
    .input(inviteMemberSchema)
    .mutation(async ({ input, ctx }) => {
      if (!hasAccess(ctx.session, input.slug)) throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse workspace" });

      const workspace = await prisma.workspace.findUnique({ where: { slug: input.slug, disabledAt: null } });
      if (!workspace) throw new TRPCError({ code: 'NOT_FOUND', message: "Workspace não encontrado" });

      for (const { email, role } of input.emails) {
        // verify if exists member with email
        const memberWithEmail = await prisma.member.findUnique({ where: { email_workspaceId: { email, workspaceId: workspace.id } } });
        if (memberWithEmail) continue;

        // verify if exists invite with email
        const invite = await prisma.invite.findUnique({ where: { workspaceId_email: { email, workspaceId: workspace.id } } });
        if (invite) {
          invite.expiresAt = new Date(Date.now() + env.WORKSPACE_INVITE_EXPIRES);
          await prisma.invite.update({ where: { id: invite.id }, data: { expiresAt: invite.expiresAt } });
          continue;
        }

        const userWithEmail = await prisma.user.findUnique({ where: { email } });

        if (userWithEmail) {
          prisma.$transaction(async (tx) => {
            const invite = await tx.invite.create({
              data: {
                workspaceId: workspace.id,
                email,
                role,
                expiresAt: moment().add(env.WORKSPACE_INVITE_EXPIRES, "seconds").toDate(),
                userId: userWithEmail.id,
              }
            });
            await addInQueue(QueueName.EMAIL, {
              to: email,
              subject: `Convite para o workspace ${workspace.name}`,
              template: EmailTemplate.INVITE,
              context: {
                workspaceName: workspace.name,
                inviteUrl: `${env.APP_URL}/invite/${invite.id}`,
                role: invite.role,
                inviterName: ctx.session.user.name ?? "",
                expirationDate: moment(invite.expiresAt).format("DD/MM/YYYY HH:mm"),
              },
            });
          })
        } else {
          prisma.$transaction(async (tx) => {
            const invite = await tx.invite.create({
              data: {
                workspaceId: workspace.id,
                email,
                role,
                expiresAt: moment().add(env.WORKSPACE_INVITE_EXPIRES, "seconds").toDate(),
              }
            });
            await addInQueue(QueueName.EMAIL, {
              to: email,
              subject: `Convite para o workspace ${workspace.name}`,
              template: EmailTemplate.INVITE,
              context: {
                workspaceName: workspace.name,
                inviteUrl: `${env.APP_URL}/invite/${invite.id}`,
                role: invite.role,
                inviterName: ctx.session.user.name ?? "",
                expirationDate: moment(invite.expiresAt).format("DD/MM/YYYY HH:mm"),
              },
            });
          })
        }
      }
    }),

  accept: protectedProcedure
    .input(getInviteSchema)
    .mutation(async ({ input, ctx }) => {
      const invite = await prisma.invite.findUnique({ where: { id: input.id } });
      if (!invite) throw new TRPCError({ code: 'NOT_FOUND', message: "Convite não encontrado" });
      if (invite.expiresAt < new Date())
        throw new TRPCError({ code: 'BAD_REQUEST', message: "Convite expirado" });
      if (invite.email !== ctx.session.user.email)
        throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse convite" });

      await prisma.member.create({
        data: {
          email: invite.email,
          role: invite.role,
          workspaceId: invite.workspaceId,
          userId: ctx.session.user.id,
        }
      })

      await prisma.invite.delete({ where: { id: input.id } });
    }),

  reject: protectedProcedure
    .input(getInviteSchema)
    .mutation(async ({ input, ctx }) => {
      const invite = await prisma.invite.findUnique({ where: { id: input.id } });
      if (!invite) throw new TRPCError({ code: 'NOT_FOUND', message: "Convite não encontrado" });

      if (invite.email !== ctx.session.user.email)
        throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse convite" });

      await prisma.invite.delete({ where: { id: input.id } });
    }),

  delete: rbacProcedure([Permission.DELETE_INVITE])
    .input(deleteInviteSchema)
    .mutation(async ({ input, ctx }) => {
      if (!hasAccess(ctx.session, input.slug)) throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse workspace" });

      await prisma.invite.delete({ where: { id: input.id } });
      await prisma.notification.deleteMany({ where: { link: `/invite?code=${input.id}` } });
    })
});