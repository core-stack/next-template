import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const code = req.nextUrl.searchParams.get('code');
  const { provider } = await params;
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  return await auth.oauth2Callback(req, provider);
}