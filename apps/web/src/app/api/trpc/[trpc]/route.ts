import { NextRequest } from 'next/server';

import { appRouter } from '@/lib/trpc/app.router';
import { createContext } from '@/lib/trpc/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    responseMeta: ({ ctx }) => ({ headers: ctx?.resHeaders || new Headers() }),
  });

export { handler as GET, handler as POST };