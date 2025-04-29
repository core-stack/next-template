import { env } from "@/env";
import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = env.GOOGLE_REDIRECT_URL;

export function GET() {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('prompt', 'consent');

  return NextResponse.redirect(url.toString());
}
