import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { z } from 'zod';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import {
  getUpdateFilePresignedUrlSchema, GetUpdateFilePresignedUrlSchema
} from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: GetUpdateFilePresignedUrlSchema }>,
  reply: FastifyReply
) {
  const key = `source/${req.tenant.id}/${randomUUID()}.${req.body.fileName.split(".").pop()}`;
  const url = await req.server.storage.getPreSignedUploadUrl(key, req.body.contentType, { temp: true });
  return reply.status(200).send({ url, key });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: getUpdateFilePresignedUrlSchema,
    response: {
      200: z.object({ url: z.string(), key: z.string() }),
      400: errorResponseSchema,
      401: errorResponseSchema,      
    }
  }
};