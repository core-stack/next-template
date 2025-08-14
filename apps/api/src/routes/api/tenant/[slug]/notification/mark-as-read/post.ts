import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import {
  getNotificationsSchema, MarkAsReadSchema, markAsReadSchema, tenantSlugParamsSchema,
  TenantSlugParamsSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema, Body: MarkAsReadSchema }>,
  reply: FastifyReply
) {
  const { slug } = req.params;
  const userId = req.session.user.id;
  const notifications = await req.server.prisma.notification.findMany({
    where: {
      id: req.body.id,
      destination: { userId: userId },
      tenant: { slug }
    },
  });
  return reply.status(200).send(notifications);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    body: markAsReadSchema,
    response: {
      200: getNotificationsSchema,
      400: errorResponseSchema,
      401: errorResponseSchema
    }
  }
};