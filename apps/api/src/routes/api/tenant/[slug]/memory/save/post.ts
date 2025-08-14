import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { SaveMemorySchema, saveMemorySchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: SaveMemorySchema }>,
  reply: FastifyReply
) {
  
}

export const options: RouteShorthandOptions = {
  schema: {
    body: saveMemorySchema
  }
};