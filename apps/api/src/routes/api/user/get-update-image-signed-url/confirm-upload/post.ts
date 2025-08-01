import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { ConfirmUploadSchema, confirmUploadSchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: ConfirmUploadSchema }>,
  reply: FastifyReply
) {
  const { session } = req;
  const { key } = req.body;
  await req.server.prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: { image: req.server.storage.buildPublicUrl(key) },
    });
    await req.server.queue['compress-image'].add("", {
      key: key,
      height: 200,
      width: 200
    });
  })
  return reply.status(200).send({ message: /*i18n*/("Image updated") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: confirmUploadSchema,
    response: {
      200: z.object({ message: z.string() }),
      400: errorResponseSchema,
      401: errorResponseSchema,
    }
  }
};