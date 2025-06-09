import { FastifyReply, FastifyRequest } from "fastify";

export default async function handler(_: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("access-token");
  reply.clearCookie("refresh-token");
  return { redirect: "/auth/login" };
}