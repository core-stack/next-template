import { comparePassword } from "@/plugins/auth/utils";
import { errorResponseSchema } from "@/schemas/error-response.schema";
import { successResponseSchema } from "@/schemas/success-response.schema";
import { DisableTenantSchema, disableTenantSchema, tenantSlugParamsSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(
  req: FastifyRequest<{ Body: DisableTenantSchema }>,
  reply: FastifyReply
) {
  const { slug, confirmText, password } = req.body;
  const tenant = await req.server.prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return reply.status(404).send({ message: /*i18n*/("Tenant not found") });
  if (tenant.name !== confirmText) return reply.status(400).send({ message: /*i18n*/("Invalid confirmation text") });

  const user = await req.server.prisma.user.findUnique({
    where: { id: req.session.user.id },
  });

  if (!user) return reply.status(401).send({ message: /*i18n*/("User not found") });
  if (!user.password) return reply.status(400).send({ message: /*i18n*/("Please set a password to disable a tenant") });
  if (!await comparePassword(password, user.password)) return reply.status(400).send({ message: /*i18n*/("Password invalid") });

  await req.server.prisma.tenant.update({
    where: { id: tenant.id },
    data: { disabledAt: new Date() }
  });
  return reply.status(200).send({ message: /*i18n*/("Tenant disabled") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: disableTenantSchema,
    params: tenantSlugParamsSchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema
    }
  }
};