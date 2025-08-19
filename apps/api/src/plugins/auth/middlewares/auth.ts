import { FastifyReply, FastifyRequest } from 'fastify';

import { Session } from '../session';

export const authMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  const accessToken = req.cookies['access-token'];
  const refreshToken = req.cookies['refresh-token'];

  let session: Session | undefined;
  try {
    req.log.info('authMiddleware', { accessToken, refreshToken });
    session = await req.server.auth.getSession(accessToken);
    
    if (!session && refreshToken) {
      const refreshResult = await req.server.auth.refreshToken(refreshToken);
      session = refreshResult.session;

      reply.setCookie("access-token", refreshResult.token.accessToken, {
        maxAge: refreshResult.token.accessTokenDuration,
        httpOnly: true,
        path: "/",
      });
      reply.setCookie("refresh-token", refreshResult.token.refreshToken, {
        maxAge: refreshResult.token.refreshTokenDuration,
        httpOnly: true,
        path: "/",
      });
    }
  } catch (e) {
    req.log.error(e);
    return reply.code(401).send({ error: 'UNAUTHORIZED', message: req.t/*i18n*/("You are not logged in") });
  }

  if (!session) return reply.code(401).send({ error: 'UNAUTHORIZED', message: req.t/*i18n*/("You are not logged in") });
  req.session = session;
};