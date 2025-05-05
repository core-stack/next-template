import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params
  const url = await auth.oauth2GetUrl(provider);
  return NextResponse.redirect(url);
}
