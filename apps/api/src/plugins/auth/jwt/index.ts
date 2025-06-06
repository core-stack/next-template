import jwt from "jsonwebtoken";

export type AccessToken = {
  sessionId: string;
  userId: string;
};

export type RefreshToken = {
  sessionId: string;
  userId: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenDuration: number;
  refreshTokenDuration: number;
};
export class JWT {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtAccessTokenDuration: number,
    private readonly jwtRefreshTokenDuration: number,
  ) {}

  generateTokens(sessionId: string, userId: string): Tokens {
    const accessTokenPayload: AccessToken = { userId, sessionId };
    const refreshTokenPayload: RefreshToken = { userId, sessionId };

    const accessToken = jwt.sign(
      accessTokenPayload,
      this.jwtSecret,
      { expiresIn: this.jwtAccessTokenDuration }
    );
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      this.jwtSecret,
      { expiresIn: this.jwtRefreshTokenDuration }
    );

    return {
      accessTokenDuration: this.jwtAccessTokenDuration,
      refreshTokenDuration: this.jwtRefreshTokenDuration,
      accessToken,
      refreshToken,
    };
  }

  verifyToken<T = AccessToken | RefreshToken>(token: string): T | null {
    try {
      return jwt.verify(token, this.jwtSecret) as T;
    } catch {
      return null;
    }
  }
}
