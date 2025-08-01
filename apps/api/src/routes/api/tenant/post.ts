import { errorResponseSchema } from "@/schemas/error-response.schema";
import { successResponseSchema } from "@/schemas/success-response.schema";
import { permissionsToNumber, ROLES } from "@packages/permission";
import { CreateTenantSchema, createTenantSchema } from "@packages/schemas";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export default async function handler(
  req: FastifyRequest<{ Body: CreateTenantSchema }>,
  reply: FastifyReply
) {
  const { session, body } = req;
  const slugInUse = async (slug: string) => {
    return !!await req.server.prisma.tenant.findUnique({ where: { slug: slug } });
  }

  // generate slug if already in use
  if (await slugInUse(body.slug)) {
    let i = 1;
    while (await slugInUse(`${body.slug}-${i}`)) i++;
    body.slug = `${body.slug}-${i}`;
  }
  await req.server.prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: body.name,
        slug: body.slug,
        roles: {
          createMany: {
            data: ROLES.tenant.default.map(role => ({
              key: role.key,
              name: role.name,
              permissions: permissionsToNumber(role.permissions),
              scope: "TENANT",
            })),
          }
        }
      }
    });

    await tx.member.create({
      data: {
        email: session.user.email,
        owner: true,
        name: session.user.name,
        image: session.user.image,
        role: {
          connect: {
            key_scope_tenantId: {
              key: ROLES.tenant.admin.key,
              scope: "TENANT",
              tenantId: tenant.id
            }
          }
        },
        tenant: {
          connect: {
            id: tenant.id
          }
        },
        user: {
          connect: {
            id: session.user.id
          }
        }
      }
    });
  });

  await req.server.auth.reloadSession(session.id);

  return reply.status(200).send({ message: /*i18n*/("Tenant created") });
}

export const options: RouteShorthandOptions = {
  schema: {
    body: createTenantSchema,
    response: {
      200: successResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema
    }
  }
};