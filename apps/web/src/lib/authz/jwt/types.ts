import { Member, User } from "@packages/prisma";

export type UserWithMembers = User & { members: Member[] }