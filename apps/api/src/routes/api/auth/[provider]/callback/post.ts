import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import z from 'zod';

export default async function handler(
  req: FastifyRequest<{ Params: OauthProvidersParamsSchema }>,
  reply: FastifyReply
) {
  const { token } = await req.server.auth.oauth2Callback(req.params.provider, req.params.code);

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
  return reply.status(200).send({ redirect: req.cookies["default-tenant"] || "/t" });
}

const oauthProvidersParamsSchema = z.object({
  provider: z.string({ message: /*i18n*/("Provider is required") }),
  code: z.string({ message: /*i18n*/("Code is required") })
}) 
type OauthProvidersParamsSchema = z.infer<typeof oauthProvidersParamsSchema>;
export const options: RouteShorthandOptions = {
  schema: {
    params: oauthProvidersParamsSchema,
    response: {
      200: z.object({ redirect: z.string() }),
    }
  }
};