import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const code = req.nextUrl.searchParams.get('code');
  const { provider } = await params;
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const res = await auth.providers[provider].callback(code);
  const token = auth.jwt.generateTokens(res.user);

  // set cookies
  const { accessToken, refreshToken, accessTokenDuration, refreshTokenDuration } = token;
  const cookie = await cookies();
  cookie.set("access-token", accessToken, { maxAge: accessTokenDuration });
  cookie.set("refresh-token", refreshToken, { maxAge: refreshTokenDuration });

  return NextResponse.redirect(new URL('/', req.url));
}