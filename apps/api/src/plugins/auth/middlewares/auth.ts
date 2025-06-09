import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const authMiddleware = async (app: FastifyInstance, req: FastifyRequest, reply: FastifyReply) => {
  const accessToken = req.cookies['access-token'];
  const refreshToken = req.cookies['refresh-token'];
  let session = await app.auth.getSession(accessToken);

  try {
    if (!session && refreshToken) {
      const refreshResult = await app.auth.refreshToken(refreshToken);
      session = refreshResult.session;

      reply.setCookie("access-token", refreshResult.token.accessToken, {
        maxAge: refreshResult.token.accessTokenDuration,
        httpOnly: true,
        domain: "/",
      });
      reply.setCookie("refresh-token", refreshResult.token.refreshToken, {
        maxAge: refreshResult.token.refreshTokenDuration,
        httpOnly: true,
        domain: "/",
      });
    }
  } catch {
    return reply.code(401).send({ error: 'UNAUTHORIZED' });
  }

  if (!session) return reply.code(401).send({ error: 'UNAUTHORIZED' });
  req.session = session;
};