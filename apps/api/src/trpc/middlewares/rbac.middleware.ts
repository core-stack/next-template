import { can, mergePermissions, numberToPermissions, Permission } from "@packages/permission";
import { TRPCError } from "@trpc/server";

import { middleware } from "../init";

import { AuthContext } from "./auth.middleware";

export const rbacMiddleware = (...requiredPermissions: Permission[]) => {
  return middleware(async ({ ctx, next, getRawInput }) => {
    const rawInput = await getRawInput();
    const { session } = (ctx as AuthContext);
    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' });

    let permissions = numberToPermissions(session.user.permissions);

    if (rawInput && typeof rawInput === 'object' && 'slug' in rawInput) {
      const tenant = session.tenants.find(
        (w) => w.slug === (rawInput as { slug: string }).slug
      );

      if (tenant) {
        permissions = mergePermissions(permissions, tenant.permissions);
      } else {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can`t access this tenant' });
      }
    }

    if (!can(permissions, requiredPermissions)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next({ ctx: { ...ctx, session, permissions } });
  });
};
