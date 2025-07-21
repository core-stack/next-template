import { RevokeSessionSchema, revokeSessionSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(
  req: FastifyRequest<{ Body: RevokeSessionSchema }>,
  reply: FastifyReply
) {
  const { sessionId } = req.body;
  await req.server.auth.finishSession(sessionId);
  return reply.status(200).send({ message: /*@i18n*/("Session revoked with success") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: revokeSessionSchema
  }
}