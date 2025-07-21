import { getByCursorSchema, GetByCursorSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(
  req: FastifyRequest<{ Params: GetByCursorSchema }>,
  reply: FastifyReply
) {
  reply.code(200).send(req.server.auth.listSessions(req.params.cursor, req.params.limit));
}

export const options: RouteShorthandOptions = {
  schema: {
    params: getByCursorSchema
  }
}