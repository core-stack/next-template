import { env } from "@/env";
import axios from "axios";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = env.GOOGLE_REDIRECT_URL;
const JWT_SECRET = env.JWT_SECRET;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const { access_token } = tokenRes.data;

  const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const profile = profileRes.data;

  const user = { id: profile.sub, email: profile.email, name: profile.name };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

  (await cookies()).set('token', token);

  return NextResponse.redirect(new URL("/", req.url));
}
