import { Member, prisma, User } from "@packages/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { UnauthorizedError } from "./error";
import { AccessToken, generateTokens, RefreshToken, verifyToken } from "./jwt";
import { Provider } from "./providers/types";
import { Session } from "./session";
import { MemoryStore } from "./store/memory";
import { RedisStore } from "./store/redis";
import { Store } from "./store/types";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export type AuthOptions = {
  providers: Provider[]
  sessionStore?: "redis" | "memory";
}
export class Authz {
  private store: Store<Session>;
  private providers: Record<string, Provider>;

  constructor(options: AuthOptions) {
    const storeType = options.sessionStore || "memory";
    this.store = storeType === "memory" ? new MemoryStore() : new RedisStore("authz");
    this.providers = options.providers.map((provider) => ({ [provider.path]: provider })).reduce((a, b) => ({ ...a, ...b }), {});
  }

  async oauth2GetUrl(provider: string) {
    return this.providers[provider].getAuthUrl();
  }

  async oauth2Callback(req: NextRequest, provider: string) {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

    const { user } = await this.providers[provider].callback(req, code);

    const { token: { accessToken, refreshToken, accessTokenDuration, refreshTokenDuration } } = await this.createSessionAndTokens(user);
    const cookie = await cookies();

    cookie.set("access-token", accessToken, { maxAge: accessTokenDuration });
    cookie.set("refresh-token", refreshToken, { maxAge: refreshTokenDuration });

    return NextResponse.redirect(new URL('/', req.url));
  }

  async createSessionAndTokens(user: User & { members: Array<Member & { workspace: { id: string, slug: string }}> }) {
    const sessionId = crypto.randomUUID();
    console.log("sessionId", sessionId);

    const token = generateTokens(sessionId, user.id);
    console.log("Generated tokens", token);

    const session: Session = {
      user: {
        id: user.id,
        email: user.email || "",
        name: user.name || "",
        role: user.role
      },
      refreshToken: token.refreshToken,
      createdAt: new Date(),
      status: "active",
      workspaces: user.members.map((m) => ({ id: m.workspaceId, slug: m.workspace.slug, role: m.role })),
      lastSeen: new Date(),
      id: sessionId,
    }
    console.log("Created session", session);

    await this.store.set(session.id, session, { expiry: token.refreshTokenDuration });
    return { token, session };
  }

  async getSession(accessToken?: string): Promise<Session | undefined> {
    if (!accessToken) throw new UnauthorizedError();
    const token = verifyToken<AccessToken>(accessToken);
    if (!token) throw new UnauthorizedError();
    const { sessionId } = token;
    const session = await this.store.get(sessionId);
    if (!session) throw new UnauthorizedError();
    session.lastSeen = new Date();
    await this.store.set(sessionId, session);
    return session
  }

  async reloadSession(sessionId: string) {
    const session = await this.store.get(sessionId);
    if (!session) throw new UnauthorizedError();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { members: { include: { workspace: true }, where: { workspace: { disabledAt: null } } } }
    });
    if (!user) throw new UnauthorizedError();
    session.workspaces = user.members.map((m) => ({ id: m.workspaceId, slug: m.workspace.slug, role: m.role }));
    session.status = "active";
    session.user.role = user.role;
    session.lastSeen = new Date();
    await this.store.set(sessionId, session);
    return session;
  }

  async finishSession(req: NextRequest) {
    const refreshTokenInCookie = req.cookies.get("refresh-token")?.value;
    if (!refreshTokenInCookie) return;
    const token = verifyToken<RefreshToken>(refreshTokenInCookie);
    if (!token) return;
    const session = await this.store.get(token.sessionId);
    if (!session) return;
    session.lastSeen = new Date();
    session.status = "revoked";
    await this.store.set(session.id, session);
  }

  async refreshToken(refreshTokenInCookie?: string) {
    if (!refreshTokenInCookie) throw new UnauthorizedError();
    const tokenData = verifyToken<RefreshToken>(refreshTokenInCookie);
    if (!tokenData) throw new UnauthorizedError();

    const { sessionId } = tokenData;
    const session = await this.store.get(sessionId);
    if (!session) throw new UnauthorizedError();
    if (session.refreshToken !== refreshTokenInCookie) throw new UnauthorizedError();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { members: { include: { workspace: true }, where: { workspace: { disabledAt: null } } } }
    });
    if (!user) throw new UnauthorizedError();
    return await this.createSessionAndTokens(user);
  }
}