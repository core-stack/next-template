import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { z } from 'zod';

export default async function handler(
  req: FastifyRequest<{ Params: OauthProvidersParamsSchema }>,
  reply: FastifyReply
) {
  const url = await req.server.auth.oauth2GetUrl(req.params.provider);
  reply.redirect(url, 302);
}

const oauthProvidersParamsSchema = z.object({
  provider: z.string({ message: /*i18n*/("Provider is required") })
}) 
type OauthProvidersParamsSchema = z.infer<typeof oauthProvidersParamsSchema>;
export const options: RouteShorthandOptions = {
  schema: {
    params: oauthProvidersParamsSchema
  }
};