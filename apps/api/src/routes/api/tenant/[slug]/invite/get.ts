import { errorResponseSchema } from "@/schemas/error-response.schema";
import { getInviteReplySchema, TenantSlugParamsSchema, tenantSlugParamsSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema }>,
  reply: FastifyReply
) {
  const tenant = await req.server.prisma.tenant.findUnique({ where: { slug: req.params.slug, disabledAt: null } });
  if (!tenant) return reply.status(404).send({ message: /*i18n*/("Tenant not found") });
  const invites = await req.server.prisma.invite.findMany({
    where: { tenantId: tenant.id },
    include: { role: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return reply.status(200).send(invites);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    response: {
      200: getInviteReplySchema.array(),
      401: errorResponseSchema,
      404: errorResponseSchema,
    }
  }
};