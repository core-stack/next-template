import { env } from "@/env";
import jwt from "jsonwebtoken";

export type AccessToken = {
  sessionId: string;
  userId: string;
}

export type RefreshToken = {
  sessionId: string;
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

export function generateTokens(sessionId: string, userId: string): Tokens {
  const accessTokenPayload: AccessToken = { userId, sessionId }
  const refreshTokenPayload: RefreshToken = { userId, sessionId }
  console.log(JWT_SECRET, JWT_ACCESS_TOKEN_DURATION, JWT_REFRESH_TOKEN_DURATION);

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