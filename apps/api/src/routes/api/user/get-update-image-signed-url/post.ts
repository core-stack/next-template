import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import {
  getUpdateImagePresignedUrlSchema, GetUpdateImagePresignedUrlSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: GetUpdateImagePresignedUrlSchema }>,
  reply: FastifyReply
) {
  const key = `user-profile/${randomUUID()}.${req.body.fileName.split(".").pop()}`;
  const url = await req.server.storage.getPreSignedUploadUrl(key, req.body.contentType, true);
  return reply.status(200).send(
    { url, key, publicUrl: req.server.storage.buildPublicUrl(key) }
  );
}

export const options: RouteShorthandOptions = {
  schema: {
    body: getUpdateImagePresignedUrlSchema,
    response: {
      200: z.object({
        url: z.string().url(),
        key: z.string(),
        publicUrl: z.string().url(),
      }),
      400: errorResponseSchema,
      401: errorResponseSchema
    }
  }
};