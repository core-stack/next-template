import { NextRequest } from 'next/server';

import { auth } from '@/lib/auth';

export const POST = (req: NextRequest) => auth.login(req);
