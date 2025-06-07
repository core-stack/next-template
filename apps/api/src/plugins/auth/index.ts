import { Member, PrismaClient, Role, User } from "@/generated/prisma";
import fp from "fastify-plugin";

import { UnauthorizedError } from "./error";
import { AccessToken, JWT, RefreshToken } from "./jwt";
import { Provider } from "./providers/types";
import { Session } from "./session";
import { MemoryStore } from "./store/memory";
import { RedisStore, RedisStoreOptions } from "./store/redis";
import { Store } from "./store/types";

export class Auth {
  constructor(
    private readonly jwt: JWT,
    private readonly store: Store<Session>,
    private readonly providers: Record<string, Provider>,
    private readonly prisma: PrismaClient,
  ) {}

  async oauth2GetUrl(provider: string) {
    return this.providers[provider].getAuthUrl();
  }

  async oauth2Callback(provider: string, code: string, ) {
    const { providerAccountId, email, name, image } = await this.providers[provider].callback(code);

    const account = await this.prisma.account.upsert({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      update: {},
      create: {
        provider,
        providerAccountId,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email, name, image, role: { connect: { id: "user" } } },
          },
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, emailVerified: true },
          include: {
            role: true,
            members: {
              include: { role: true, tenant: { select: { id: true, slug: true } } },
            },
          },
        },
      },
    });
    return await this.createSessionAndTokens(account.user);
  }

  async createSessionAndTokens(user: User & { members: Array<Member & { tenant: { id: string; slug: string }; role: Role }>; role: Role }) {
    const sessionId = crypto.randomUUID();

    const token = this.jwt.generateTokens(sessionId, user.id);

    const session: Session = {
      user: {
        id: user.id,
        email: user.email || "",
        name: user.name || "",
        permissions: user.role.permissions,
      },
      refreshToken: token.refreshToken,
      createdAt: new Date(),
      status: "active",
      tenants: user.members.map((m) => ({
        id: m.tenantId,
        slug: m.tenant.slug,
        memberId: m.id,
        permissions: m.role.permissions,
      })),
      lastSeen: new Date(),
      id: sessionId,
    };
    console.log("Created session", session);

    await this.store.set(session.id, session, { expiry: token.refreshTokenDuration });
    return { token, session };
  }

  async getSession(accessToken?: string): Promise<Session | undefined> {
    if (!accessToken) throw new UnauthorizedError();
    const token = this.jwt.verifyToken<AccessToken>(accessToken);
    if (!token) throw new UnauthorizedError();
    const { sessionId } = token;
    const session = await this.store.get(sessionId);
    if (!session) throw new UnauthorizedError();
    session.lastSeen = new Date();
    await this.store.set(sessionId, session);
    return session;
  }

  async reloadSession(sessionId: string) {
    const session = await this.store.get(sessionId);
    if (!session) throw new UnauthorizedError();
    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        members: {
          include: { tenant: true, role: true },
          where: { tenant: { disabledAt: null } },
        },
        role: true,
      },
    });
    if (!user) throw new UnauthorizedError();
    session.tenants = user.members.map((m) => ({
      id: m.tenantId,
      slug: m.tenant.slug,
      memberId: m.id,
      permissions: m.role.permissions,
    }));
    session.status = "active";
    session.user.permissions = user.role.permissions;
    session.lastSeen = new Date();
    await this.store.set(sessionId, session);
    return session;
  }

  async finishSession(refreshToken: string) {
    const token = this.jwt.verifyToken<RefreshToken>(refreshToken);
    if (!token) return;
    const session = await this.store.get(token.sessionId);
    if (!session) return;
    session.lastSeen = new Date();
    session.status = "revoked";
    await this.store.set(session.id, session);
  }

  async refreshToken(refreshToken?: string) {
    if (!refreshToken) throw new UnauthorizedError();
    const tokenData = this.jwt.verifyToken<RefreshToken>(refreshToken);
    if (!tokenData) throw new UnauthorizedError();

    const { sessionId } = tokenData;
    const session = await this.store.get(sessionId);
    if (!session) throw new UnauthorizedError();
    if (session.refreshToken !== refreshToken) throw new UnauthorizedError();

    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id },
      include: { role: true, members: { include: { tenant: true, role: true }, where: { tenant: { disabledAt: null } } } },
    });
    if (!user) throw new UnauthorizedError();
    return await this.createSessionAndTokens(user);
  }
}
type RedisOptions = {
  type: "redis";
  options: RedisStoreOptions;
}
type MemoryOptions = {
  type: "memory";
}
type AuthOptions = {
  providers: Record<string, Provider>;
  store: RedisOptions | MemoryOptions;
  jwt: {
    secret: string;
    accessTokenDuration?: number;
    refreshTokenDuration?: number;
  }
}
export default fp(async (app, opts: AuthOptions) => {
  app.log.info("Registering auth plugin");
  const store = opts.store.type === "redis" ?
    new RedisStore<Session>(opts.store.options) :
    new MemoryStore<Session>();

  const jwt = new JWT(
    opts.jwt.secret,
    opts.jwt.accessTokenDuration || 15 * 60, // 15 minutes
    opts.jwt.refreshTokenDuration || 60 * 60 * 24 * 30, // 30 days
  );
  if (!app.prisma) {
    throw new Error("Prisma client is not available in the app instance");
  }
  const auth = new Auth(
    jwt,
    store,
    opts.providers,
    app.prisma
  );
  app.decorate("auth", auth);
  app.log.info("Auth plugin registered successfully");
})

declare module "fastify" {
  interface FastifyInstance {
    auth: Auth;
  }
}