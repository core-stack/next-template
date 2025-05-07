import cookie from 'cookie';

import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';

import { Context } from './context';

const t = initTRPC.context<Context>().create();
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
      const accessToken = cookie.serialize('access-token', refreshResult.token.accessToken, {
        maxAge: refreshResult.token.accessTokenDuration,
        httpOnly: true,
      });
      const refreshToken = cookie.serialize('refresh-token', refreshResult.token.refreshToken, {
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

// export const rbacMiddleware = (requiredPermissions: Permission[]) => {
//   return middleware(async ({ ctx, next, getRawInput }) => {
//     const rawInput = await getRawInput();
//     if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' });

//     const userPermissions = getRolePermissions(ctx.session.user.role as UserRoleType);

//     if (rawInput && typeof rawInput === 'object' && 'workspaceSlug' in rawInput) {
//       const workspace = ctx.session.workspaces.find(
//         (w) => w.slug === (rawInput as { workspaceSlug: string }).workspaceSlug
//       );

//       if (workspace) {
//         userPermissions.push(...getRolePermissions(workspace.role as UserRole));
//       }
//     }

//     if (!can(userPermissions, requiredPermissions)) {
//       throw new TRPCError({ code: 'FORBIDDEN' });
//     }

//     return next({ ctx: { ...ctx, userPermissions } });
//   });
// };

export const protectedProcedure = publicProcedure.use(authMiddleware);
// export const rbacProcedure = (permissions: Permission[]) => protectedProcedure.use(rbacMiddleware(permissions));