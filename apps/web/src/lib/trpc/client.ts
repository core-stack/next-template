'use client';

import { createTRPCReact } from '@trpc/react-query';

import { AppRouter } from './app.router';

export const trpc = createTRPCReact<AppRouter>();