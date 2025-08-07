import { errorResponseSchema } from "@/schemas/error-response.schema";
import { getNotificationsSchema, tenantSlugParamsSchema, TenantSlugParamsSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema, Querystring:  }>,
  reply: FastifyReply
) {
  const { slug } = req.params;
  const userId = req.session.user.id;
  const notifications = await req.server.prisma.notification.findMany({
    where: {
      destination: { userId: userId },
      tenant: { slug }
    },
  });
  return reply.status(200).send(notifications);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    response: {
      200: getNotificationsSchema,
      400: errorResponseSchema,
      401: errorResponseSchema
    }
  }
};