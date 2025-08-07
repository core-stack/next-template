import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import { z } from "zod";

export default async function handler(
  req: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
  reply: FastifyReply
) {
  await req.server.prisma.$transaction(async (tx) => {
    await tx.invite.delete({ where: { id: req.params.id } });
    await tx.notification.deleteMany({ where: { link: `/invite?code=${req.params.id}` } });
  });

  return reply.status(200).send({ message: /*i18n*/("Invite deleted") });
}

const paramsSchema = z.object({ id: z.string(), slug: z.string() });

export const options: RouteShorthandOptions = {
  schema: {
    params: paramsSchema
  }
};