import { GetByCursorSchema, getByCursorSchema, getUserSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(req: FastifyRequest<{ Params: GetByCursorSchema }>, reply: FastifyReply) {
  const users = await req.server.prisma.user.findMany({
    select: {
      id: true,
      email: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      role: true,
      image: true,
      members: { include: { role: true, tenant: { select: { id: true, slug: true, name: true } }} }
    },
    take: req.params.limit,
    skip: (req.params.cursor - 1) * req.params.limit
  });
  reply.send(users);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: getByCursorSchema,
    response: {
      200: getUserSchema.array(),
    }
  }
}