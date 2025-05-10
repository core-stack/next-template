import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';

import { auth } from '../auth';
import { appRouter } from './app.router';
import { makeQueryClient } from './query-client';
import { createCallerFactory } from './trpc';

export const getQueryClient = cache(makeQueryClient);

export const caller = createCallerFactory(appRouter)(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;
  const session = await auth.getSession(accessToken);
  return { session, accessToken, resHeaders: new Headers() };
});
export const publicCaller = createCallerFactory(appRouter)(async () => {
  return { resHeaders: new Headers() };
});