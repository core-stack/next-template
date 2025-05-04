import { z } from 'zod';

import { env } from '@/env';
import { Session } from '@/lib/authz/session';
import { sendNotification } from '@/lib/notification';
import { prisma } from '@packages/prisma';
import { TRPCError } from '@trpc/server';

import { inviteMemberSchema, memberSchema } from '../schema/member';
import { protectedProcedure, router } from '../server';

const hasAccess = (session: Session, slug: string) => session.workspaces.some((w) => w.slug === slug);

export const memberRouter = router({
  getInWorkspace: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .output(memberSchema.array())
    .query(async ({ input, ctx }) => {
      if (!hasAccess(ctx.session, input.slug)) throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse workspace" });
      return await prisma.member.findMany({
        where: { workspace: { slug: input.slug } },
        include: { user: { select: { id: true, email: true, name: true, image: true }} },
      });
    }),
  
  invite: protectedProcedure
    .input(inviteMemberSchema)
    .mutation(async ({ input, ctx }) => {
      if (!hasAccess(ctx.session, input.slug)) throw new TRPCError({ code: 'FORBIDDEN', message: "Você não tem acesso a esse workspace" });

      const workspace = await prisma.workspace.findUnique({ where: { slug: input.slug }});
      if (!workspace) throw new TRPCError({ code: 'NOT_FOUND', message: "Workspace nao encontrado" });

      for (const { email, role } of input.emails) {
        // verify if exists member with email
        const memberWithEmail = await prisma.member.findUnique({ where: { email_workspaceId: { email, workspaceId: workspace.id } }});
        if (memberWithEmail) continue;
        
        // verify if exists invite with email
        const invite = await prisma.invite.findUnique({where: { workspaceId_email: { email, workspaceId: workspace.id } }});
        if (invite) {
          invite.expiresAt = new Date(Date.now() + env.WORKSPACE_INVITE_EXPIRES_IN_MS);
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
                expiresAt: new Date(Date.now() + env.WORKSPACE_INVITE_EXPIRES_IN_MS),
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
          })
        } else {
          await prisma.invite.create({
            data: {
              workspaceId: workspace.id,
              email,
              expiresAt: new Date(Date.now() + env.WORKSPACE_INVITE_EXPIRES_IN_MS),
            }
          });
        }
      }
    })
})