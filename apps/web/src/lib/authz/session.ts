import { UserRole, WorkspaceRole } from "@packages/prisma";

export type Session = {
  id: string
  status: "active" | "revoked"
  user: {
    id: string
    email: string
    name?: string
    image?: string
    role: UserRole
  }
  lastSeen: Date
  createdAt: Date
  refreshToken: string
  workspaces: {
    id: string
    slug: string
    role: WorkspaceRole
  }[]
}