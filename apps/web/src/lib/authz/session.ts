import { Role } from '@packages/prisma';

export type Session = {
  id: string
  user: {
    id: string
    email?: string
    name?: string
    role: Role
  }
  lastSeen: Date
  createdAt: Date
  workspaces: {
    id: string
    slug: string
    role: Role
  }[]
}