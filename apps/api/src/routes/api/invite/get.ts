import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { getInviteReplySchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Params: z.infer<typeof paramsSchema>, Querystring: z.infer<typeof queryParamsSchema> }>,
  reply: FastifyReply
) {
  const { slug } = req.params;
  const invite = await req.server.prisma.invite
    .findMany({ where: { tenant: { slug } }, include: { tenant: req.query.includeTenant } });

  if (!invite) return reply.status(404).send({ message: /*i18n*/("Invite not found") });
  return reply.status(200).send(invite);
}

const paramsSchema =  z.object({ slug: z.string({ message: /*i18n*/("slug is required") }) });
const queryParamsSchema = z.object({ includeTenant: z.boolean().optional() });
export const options: RouteShorthandOptions = {
  schema: {
    params: paramsSchema,
    querystring: queryParamsSchema,
    response: {
      200: getInviteReplySchema,
      400: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};