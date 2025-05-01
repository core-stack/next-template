import { NextRequest } from 'next/server';

import { Account, Member, User } from '@packages/prisma';

export type AccountWithMembers = Account & { user: User & { members: Array<Member & { workspace: { id: string, slug: string }}> } };
export interface Provider {
  path: string;
  getAuthUrl(): string | Promise<string>
  callback(req: NextRequest, code: string): AccountWithMembers | Promise<AccountWithMembers>
}