import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';
import { can, getRolePermissions, Permission, RoleName } from '@packages/permission';

import { Authz } from './authz';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from './authz/error';
import { GoogleProvider } from './authz/providers/google';
import { Session } from './authz/session';

export const auth = new Authz({
  providers: [
    GoogleProvider({
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI: env.GOOGLE_REDIRECT_URL
    }),
  ],
  sessionStore: "redis",
})

type HandlerWithError = (
  req: NextRequest,
  context: { params: Record<string, string> }
) => Promise<Response> | Response;

type HandlerWithAuth = (
  req: NextRequest,
  session: Session,
  context: { params: Record<string, string> }
) => Promise<Response> | Response;

export function withError(handler: HandlerWithError) {
  return async (req: NextRequest, context: { params: Record<string, string> }) => {
    try {
      return await handler(req, context);
    } catch (error) {
      let status = 500;
      if (error instanceof NotFoundError) status = 404;
      else if (error instanceof ForbiddenError) status = 403;
      else if (error instanceof BadRequestError) status = 400;
      else if (error instanceof UnauthorizedError) status = 500;
      console.error('API error:', error);
      return NextResponse.json({ error: (error as Error).message }, { status });
    }
  }
}

export function withAuth(handler: HandlerWithAuth) {
  return withError(async (req: NextRequest, context: { params: Record<string, string> }) => {
    let session: Session | null = null;
    try {
      session = await auth.getSession(req);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        // refresh
        const refreshResult = await auth.refreshToken(req);
        session = refreshResult.session;
      } else {
        throw error;
      }
    }
    if (!session) throw new UnauthorizedError();

    return await handler(req, session, context);
  });
}

export function withRBAC(opts: { permissions: Permission[] }, handler: HandlerWithAuth) {
  return withAuth(async (req: NextRequest, session: Session, context: { params: Record<string, string> }) => {
    const { permissions } = opts;
    let userPermissions = getRolePermissions(session.user.role as RoleName);
    
    if (context.params.slug) {
      const workspace = session.workspaces.find((w) => w.slug === context.params.slug);
      if (workspace) userPermissions.push(...getRolePermissions(workspace.role  as RoleName));
    }

    if (!can(userPermissions, permissions)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(req, session, context);
  });
}