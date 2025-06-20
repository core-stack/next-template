import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { inviteWithTenantSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
  reply: FastifyReply
) {
  const { id } = req.params;
  const invite = await req.server.prisma.invite.findUnique({ where: { id }, include: { tenant: true } });
  if (!invite) return reply.status(404).send({ message: /*i18n*/("Invite not found") });
  return invite;
}
const paramsSchema =  z.object({ id: z.string({ message: /*i18n*/("ID is required") }).uuid(/*i18n*/("ID must be a valid UUID")) })

export const options: RouteShorthandOptions = {
  schema: {
    params: paramsSchema,
    response: {
      200: inviteWithTenantSchema,
      400: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};