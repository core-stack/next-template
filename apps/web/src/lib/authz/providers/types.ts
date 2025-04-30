import { Account, Member, User } from "@packages/prisma";

export type AccountWithMembers = Account & { user: User & { members: Member[] } };
export interface Provider {
  path: string;
  getAuthUrl(): string | Promise<string>
  callback(code: string): AccountWithMembers | Promise<AccountWithMembers>
}