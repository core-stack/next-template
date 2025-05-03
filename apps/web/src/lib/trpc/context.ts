import { NextRequest } from 'next/server';

import { auth } from '@/lib/auth';

export async function createContext(req: NextRequest) {
  try {
    const session = await auth.getSession(req);
    return { req, session, resHeaders: new Headers() };
  } catch {
    return { req };
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>;