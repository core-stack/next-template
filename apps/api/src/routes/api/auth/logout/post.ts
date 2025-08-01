import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import z from "zod";

export default async function handler(_: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("access-token");
  reply.clearCookie("refresh-token");
  return { redirect: "/auth/login" };
}
export const options: RouteShorthandOptions = {
  schema: {
    response: {
      200: z.object({ redirect: z.string() }),
    }
  }
};