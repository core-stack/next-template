import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

import { comparePassword } from '@/plugins/auth/utils';
import { LoginSchema, loginSchema } from '@packages/schemas';

export default async function handler(req: FastifyRequest<{ Body: LoginSchema }>, reply: FastifyReply) {
  const { email, password, redirect } = req.body;
  const user = await req.server.prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      members: { include: { tenant: { select: { id: true, slug: true } }, role: true } }
    }
  });
  if (!user) return reply.status(401).send({ message: /*i18n*/("Email or password invalid") });

  if (!user.password) return reply.status(401).send({ message: /*i18n*/("Email or password invalid") });

  const valid = await comparePassword(password, user.password);
  if (!valid) return reply.status(401).send({ message: /*i18n*/("Email or password invalid") });

  const { token } = await req.server.auth.createSessionAndTokens(user);

  reply.setCookie("access-token", token.accessToken, {
    maxAge: token.accessTokenDuration,
    httpOnly: true,
    path: "/",
  });
  reply.setCookie("refresh-token", token.refreshToken, {
    maxAge: token.refreshTokenDuration,
    httpOnly: true,
    path: "/",
  });
  return reply.status(200).send({ redirect: redirect || req.cookies["default-tenant"] || "/t" });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: loginSchema,
    response: {
      200: z.object({ redirect: z.string(), }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() })
    }
  }
}