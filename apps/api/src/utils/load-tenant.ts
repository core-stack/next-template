import { PrismaClient } from '@/__generated__/prisma';

export const getTenantFromSlug = async (prisma: PrismaClient, slug: string, ignoreDisabled = true) => {
  return await prisma.tenant.findUnique({ where: { slug: slug, disabledAt: ignoreDisabled ? null : undefined } });
}