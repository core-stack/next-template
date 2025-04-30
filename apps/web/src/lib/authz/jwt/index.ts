import { env } from "@/env";
import { Role } from "@packages/prisma";
import jwt from "jsonwebtoken";

import { UserWithMembers } from "./types";

export type AccessToken = {
  userId: string;
  workspaces: { [workspaceId: string]: Role };
}

export type RefreshToken = {
  userId: string;
}

const JWT_SECRET = env.JWT_SECRET;
const JWT_ACCESS_TOKEN_DURATION = env.JWT_ACCESS_TOKEN_DURATION;
const JWT_REFRESH_TOKEN_DURATION = env.JWT_REFRESH_TOKEN_DURATION;

type Tokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenDuration: number;
  refreshTokenDuration: number;
}

export function generateTokens(user: UserWithMembers): Tokens {
  const accessTokenPayload: AccessToken = {
    userId: user.id,
    workspaces: user.members.reduce((acc, member) => ({ ...acc, [member.workspaceId]: member.role }), {}),
  }
  const refreshTokenPayload: RefreshToken = { userId: user.id }

  return {
    accessTokenDuration: JWT_ACCESS_TOKEN_DURATION,
    refreshTokenDuration: JWT_REFRESH_TOKEN_DURATION,
    accessToken: jwt.sign(accessTokenPayload, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_DURATION }),
    refreshToken: jwt.sign(refreshTokenPayload, JWT_SECRET, { expiresIn: JWT_REFRESH_TOKEN_DURATION }),
  }
}

export function verifyToken<T = AccessToken | RefreshToken>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T
  } catch {
    return null
  }
}