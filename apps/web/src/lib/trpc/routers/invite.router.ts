import moment from 'moment';
import { z } from 'zod';

import { env } from '@/env';
import { sendNotification } from '@/lib/notification';
import { hasAccess } from '@/lib/utils';
import { prisma } from '@packages/prisma';
import { addInQueue, EmailTemplate, QueueName } from '@packages/queue';
import { TRPCError } from '@trpc/server';

import { inviteMemberSchema } from '../schema/invite';
import { protectedProcedure, router } from '../trpc';

export const inviteRouter = router({
  getByWorkspace: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const invites = await prisma.invite.findMany({
        where: { workspace: { slug: input.slug, disabledAt: null } },
      });
      return invites;
    }),

  invite: protectedProcedure
    .input(inviteMemberSchema)
    .mutation(async ({ input, ctx }) => {
      if (!hasAccess(ctx.session, input.slug)) throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse workspace" });

      const workspace = await prisma.workspace.findUnique({ where: { slug: input.slug, disabledAt: null }});
      if (!workspace) throw new TRPCError({ code: 'NOT_FOUND', message: "Workspace não encontrado" });

      for (const { email, role } of input.emails) {
        // verify if exists member with email
        const memberWithEmail = await prisma.member.findUnique({ where: { email_workspaceId: { email, workspaceId: workspace.id } }});
        if (memberWithEmail) continue;

        // verify if exists invite with email
        const invite = await prisma.invite.findUnique({where: { workspaceId_email: { email, workspaceId: workspace.id } }});
        if (invite) {
          invite.expiresAt = new Date(Date.now() + env.WORKSPACE_INVITE_EXPIRES);
          await prisma.invite.update({where: { id: invite.id }, data: { expiresAt: invite.expiresAt }});
          continue;
        }

        const userWithEmail = await prisma.user.findUnique({where: { email }});

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
            sendNotification({
              tx,
              userId: userWithEmail.id,
              title: "Convite para o workspace",
              description: `Voce foi convidado para o workspace ${workspace.name}`,
              link: `/invite?code=${invite.id}`,
            });
            await addInQueue(QueueName.EMAIL, {
              to: email,
              subject: "Convite para o workspace",
              template: EmailTemplate.INVITE,
              context: {
                workspaceName: workspace.name,
                inviteUrl: `${env.APP_URL}/invite?code=${invite.id}`,
              },
            });
          })
        } else {
          const invite = await prisma.invite.create({
            data: {
              workspaceId: workspace.id,
              email,
              expiresAt: moment().add(env.WORKSPACE_INVITE_EXPIRES, "seconds").toDate(),
            }
          });
          await addInQueue(QueueName.EMAIL, {
            to: email,
            subject: "Convite para o workspace",
            template: EmailTemplate.INVITE,
            context: {
              workspaceName: workspace.name,
              inviteUrl: `${env.APP_URL}/invite?code=${invite.id}`,
            },
          });
        }
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string(), slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!hasAccess(ctx.session, input.slug)) throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse workspace" });

      await prisma.invite.delete({ where: { id: input.id } });
      await prisma.notification.deleteMany({ where: { link: `/invite?code=${input.id}` } });
    })
});