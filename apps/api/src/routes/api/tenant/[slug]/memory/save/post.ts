import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

import { saveMemory } from '@/memory/save';
import { SaveMemorySchema, saveMemorySchema } from '@packages/schemas';

export default async function handler(
  req: FastifyRequest<{ Body: SaveMemorySchema }>,
  reply: FastifyReply
) {
  const group = await req.server.prisma.group.findUnique({ where: { id: req.body.groupId } });
  req.log.info('saveMemory', { group, body: req.body });
  await saveMemory({
    groupPath: group.name,
    createdBy: req.tenant.memberId,
    tenantId: req.tenant.id,
    text: req.body.text,
    title: req.body.title,
    type: req.body.type,
    sourceType: "text"
  });
  return reply.status(200).send({ message: /*i18n*/("Memory saved") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: saveMemorySchema
  }
};