import { serialize as cookieSerialize } from "cookie";
import superJSON from "superjson";

import { auth } from "@/lib/auth";
import { can, getRolePermissions, Permission } from "@packages/permission";
import { initTRPC, TRPCError } from "@trpc/server";

import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superJSON,
});
export const { createCallerFactory } = t;

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

const authMiddleware = middleware(async ({ ctx, next }) => {
  let session = ctx.session;
  const hasRefreshToken = !!ctx.refreshToken;
  try {
    if (!session && hasRefreshToken) {
      const refreshResult = await auth.refreshToken(ctx.refreshToken);
      session = refreshResult.session;
      const accessToken = cookieSerialize('access-token', refreshResult.token.accessToken, {
        maxAge: refreshResult.token.accessTokenDuration,
        httpOnly: true,
      });
      const refreshToken = cookieSerialize('refresh-token', refreshResult.token.refreshToken, {
        maxAge: refreshResult.token.refreshTokenDuration,
        httpOnly: true,
      });
      ctx.resHeaders!.set('Set-Cookie', accessToken);
      ctx.resHeaders!.set('Set-Cookie', refreshToken);
    }
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return next({ ctx: { ...ctx, session } });
});

export const rbacMiddleware = (requiredPermissions: Permission[]) => {
  return middleware(async ({ ctx, next, getRawInput }) => {
    const rawInput = await getRawInput();
    const { session } = ctx;
    if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const userPermissions = getRolePermissions(session.user.role);

    if (rawInput && typeof rawInput === 'object' && 'slug' in rawInput) {
      const workspace = session.workspaces.find(
        (w) => w.slug === (rawInput as { slug: string }).slug
      );

      if (workspace) {
        userPermissions.push(...getRolePermissions(workspace.role));
      }
    }

    if (!can(userPermissions, requiredPermissions)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next({ ctx: { ...ctx, session, userPermissions } });
  });
};

export const protectedProcedure = publicProcedure.use(authMiddleware);
export const rbacProcedure = (permissions: Permission[]) => protectedProcedure.use(rbacMiddleware(permissions));