import { errorResponseSchema } from "@/schemas/error-response.schema";
import { getMembersInTenantSchema, tenantSlugParamsSchema, TenantSlugParamsSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(
  req: FastifyRequest<{ Params: TenantSlugParamsSchema }>,
  reply: FastifyReply
) {
  const tenant = await req.server.prisma.tenant.findUnique({ where: { slug: req.params.slug, disabledAt: null } });
  if (!tenant) return reply.status(404).send({ message: /*i18n*/("Tenant not found") });

  const members = await req.server.prisma.member.findMany({ where: { tenantId: tenant.id } });
  return reply.status(200).send(members);
}

export const options: RouteShorthandOptions = {
  schema: {
    params: tenantSlugParamsSchema,
    response: {
      200: getMembersInTenantSchema,
      401: errorResponseSchema,
      404: errorResponseSchema
    }
  }
};