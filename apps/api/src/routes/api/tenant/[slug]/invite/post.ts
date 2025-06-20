import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import moment from 'moment';

import { env } from '@/env';
import { EmailTemplate } from '@/queue/schemas/email';
import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';
import { InviteMemberSchema, inviteMemberSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: InviteMemberSchema }>,
  reply: FastifyReply
) {
  const tenant = await req.server.prisma.tenant.findUnique({ where: { slug: req.body.slug, disabledAt: null } });
  if (!tenant) return reply.status(404).send({ message: /*i18n*/("Workspace not found") });

  for (const { email, role } of req.body.emails) {
    // verify if exists member with email
    const memberWithEmail = await req.server.prisma.member.findUnique({ where: { email_tenantId: { email, tenantId: tenant.id } } });
    if (memberWithEmail) continue;

    // verify if exists invite with email
    const invite = await req.server.prisma.invite.findUnique({ where: { tenantId_email: { email, tenantId: tenant.id } }, include: { role: true } });
    if (invite) {
      if (invite.expiresAt < new Date()) {
        invite.expiresAt = moment().add(env.DEFAULT_INVITE_EXPIRES).toDate();
        await req.server.prisma.$transaction(async (tx) => {
          await req.server.queue.email.add("", {
            to: email,
            subject: /*i18n*/("You have been invited to ") + tenant.name,
            template: EmailTemplate.INVITE,
            context: {
              tenantName: tenant.name,
              inviteUrl: `${env.FRONTEND_URL}/invite/${invite.id}`,
              role: invite.role.name,
              inviterName: req.session.user.name ?? "",
              expirationDate: moment(invite.expiresAt).format("DD/MM/YYYY HH:mm"),
            },
          });
          await tx.invite.update({ where: { id: invite.id }, data: { expiresAt: invite.expiresAt } });
        });
        continue;
      } else {
        continue;
      }
    }

    const userWithEmail = await req.server.prisma.user.findUnique({ where: { email } });

    await req.server.prisma.$transaction(async (tx) => {
      const invite = await tx.invite.create({
        data: {
          tenant: { connect: { id: tenant.id } },
          email,
          role: { connect: { id: role } },
          expiresAt: moment().add(env.DEFAULT_INVITE_EXPIRES).toDate(),
          creator: { connect: { id: req.session.user.id } },
          user: userWithEmail ? { connect: { id: userWithEmail.id } } : undefined,
        },
        include: { role: true }
      });

      await req.server.queue.email.add("", {
        to: email,
        subject: `Convite para o workspace ${tenant.name}`,
        template: EmailTemplate.INVITE,
        context: {
          tenantName: tenant.name,
          inviteUrl: `${env.FRONTEND_URL}/invite/${invite.id}`,
          role: invite.role.name,
          inviterName: req.session.user.name ?? "",
          expirationDate: moment(invite.expiresAt).format("DD/MM/YYYY HH:mm"),
        },  
      });
    });
  }

  return { message: /*i18n*/("Invites sent successfully") };
}

export const options: RouteShorthandOptions = {
  schema: {
    body: inviteMemberSchema,
    response: {
      200: successResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    }
  }
};