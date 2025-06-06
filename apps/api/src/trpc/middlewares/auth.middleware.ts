import { Session } from "@/plugins/auth/session";
import { Context } from "@/trpc/context";
import { TRPCError } from "@trpc/server";

import { middleware } from "../init";

export const authMiddleware = middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  const accessToken = req.cookies['access-token'];
  const refreshToken = req.cookies['refresh-token'];

  let session = await ctx.auth.getSession(accessToken);

  try {
    if (!session && refreshToken) {
      const refreshResult = await ctx.auth.refreshToken(refreshToken);
      session = refreshResult.session;

      ctx.res.setCookie("access-token", refreshResult.token.accessToken, {
        maxAge: refreshResult.token.accessTokenDuration,
        httpOnly: true,
        domain: "/",
      });
      ctx.res.setCookie("refresh-token", refreshResult.token.refreshToken, {
        maxAge: refreshResult.token.refreshTokenDuration,
        httpOnly: true,
        domain: "/",
      });
    }
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return next({ ctx: { ...ctx, session } });
});

export type AuthContext = Context & {
  session: Session;
}