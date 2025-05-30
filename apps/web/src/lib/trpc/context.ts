import { NextRequest } from 'next/server';

import { auth } from '@/lib/auth';

import { Session } from '../authz/session';

export async function createContext(req: NextRequest) {
  const accessToken = req.cookies.get('access-token')?.value;
  const refreshToken = req.cookies.get('refresh-token')?.value;
  try {
    const session = await auth.getSession(accessToken);
    return { session, resHeaders: new Headers(), accessToken, refreshToken };
  } catch {
    return { session: undefined, resHeaders: new Headers(), accessToken, refreshToken };
  }
}

export type Context = {
  session?: Session;
  resHeaders?: Headers;
  accessToken?: string;
  refreshToken?: string;
}