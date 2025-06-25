import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { getTenantsList } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { session } = req;
  const tenants = await req.server.prisma.tenant
    .findMany({ 
      where: { members: { some: { id: session.user.id } } }, 
      include: { _count: { select: { members: true }} }
    });

  return reply
    .status(200)
    .send(tenants.map(t => ({ ...t, membersCount: t._count.members })));
}

export const options: RouteShorthandOptions = {
  schema: {
    response: {
      200: getTenantsList,
      401: errorResponseSchema
    }
  }
};