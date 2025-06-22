import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { errorResponseSchema } from '@/schemas/error-response.schema';
import { successResponseSchema } from '@/schemas/success-response.schema';

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  
}

export const options: RouteShorthandOptions = {
  schema: {
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema
    }
  }
};