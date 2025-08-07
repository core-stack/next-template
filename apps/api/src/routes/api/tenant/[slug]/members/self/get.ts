import { errorResponseSchema } from "@/schemas/error-response.schema";
import { getMemberInTenantSchema, TenantSlugParamsSchema, tenantSlugParamsSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema }>,
  reply: FastifyReply
) {
  const tenant = await req.server.prisma.tenant.findUnique({ where: { slug: req.params.slug, disabledAt: null } });
  if (!tenant) return reply.status(404).send({ message: /*i18n*/("Tenant not found") });

  const member = await req.server.prisma.member.findUnique({ where: { userId_tenantId: { tenantId: tenant.id, userId: req.session.user.id } } });
  if (!member) return reply.status(404).send({ message: /*i18n*/("Member not found") });
  return member;
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    response: {
      200: getMemberInTenantSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema
    }
  }
}