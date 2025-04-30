import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const token = await auth.login(body);
  // set cookies
  const { accessToken, refreshToken, accessTokenDuration, refreshTokenDuration } = token;
  const cookie = await cookies();
  cookie.set("access-token", accessToken, { maxAge: accessTokenDuration });
  cookie.set("refresh-token", refreshToken, { maxAge: refreshTokenDuration });

  return NextResponse.redirect(new URL('/', req.url));
}