import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { env } from '@/env';
import { Member, prisma, User } from '@packages/prisma';

import { UnauthorizedError } from './error';
import { AccessToken, generateTokens, verifyToken } from './jwt';
import { Provider } from './providers/types';
import { Session } from './session';
import { MemoryStore } from './store/memory';
import { RedisStore } from './store/redis';
import { Store } from './store/types';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const createAccountSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


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

  async login(req: NextRequest) {
    const body = await req.json();

    const { email, password } = await loginSchema.parseAsync(body);
  
    const user = await prisma.user.findUnique({ 
      where: { email }, 
      include: { 
        members: { include: { workspace: { select: { id: true, slug: true } }} }
      }
    });
  
    if (!user) return NextResponse.json({error: "Email ou senha incorretos"}, { status: 400});
    if (!user.password) return NextResponse.json({error: "Email ou senha incorretos"}, { status: 400});
    const valid = await comparePassword(password, user.password);
    if (!valid) return NextResponse.json({error: "Email ou senha incorretos"}, { status: 400});
  
    const { token: { accessToken, refreshToken, accessTokenDuration, refreshTokenDuration } } = await this.createSessionAndTokens(user);
    const cookie = await cookies();

    cookie.set("access-token", accessToken, { maxAge: accessTokenDuration });
    cookie.set("refresh-token", refreshToken, { maxAge: refreshTokenDuration });
    let redirect = req.nextUrl.searchParams.get('redirect');
    if (redirect === "null") redirect = "/";
    return NextResponse.json({ redirect }, { status: 200 });
  }

  async createAccount(req: NextRequest) {
    const body = await req.json();
    // validate
    let { email, name, password } = createAccountSchema.parse(body);
    // verify email in use
    const userWithEmail = await prisma.user.findUnique({where: { email: email }});
    if (userWithEmail) return NextResponse.json({ error: "Email já em uso" }, { status: 400 });
  
    // hash password
    password = await hashPassword(password);
  
    // create user
    const user = await prisma.user.create({
      data: {
        email, name, password,
        verificationToken: {
          create: {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            type: "ACTIVE_ACCOUNT"
          }
        }
      }
    });
    user.password = null;
    return NextResponse.json(user);
  }

  private async createSessionAndTokens(user: User & { members: Array<Member & { workspace: { id: string, slug: string }}> }) {
    const session: Session = {
      user: {
        id: user.id,
        email: user.email || "",
        name: user.name || "",
        role: user.role
      },
      createdAt: new Date(),
      workspaces: user.members.map((m) => ({ id: m.workspaceId, slug: m.workspace.slug, role: m.role })),
      lastSeen: new Date(),
      id: crypto.randomUUID(),
    }
    await this.store.set(session.id, session, { expiry: env.SESSION_DURATION });
    const token = generateTokens(session.id, user.id);
    return { token, session };
  }

  async getSession(req: NextRequest): Promise<Session | null> {
    const cookie = req.cookies.get("access-token")?.value;
    if (!cookie) throw new UnauthorizedError();
    const token = verifyToken<AccessToken>(cookie);
    if (!token) throw new UnauthorizedError();
    const { sessionId } = token;
    return await this.store.get(sessionId);
  }
}