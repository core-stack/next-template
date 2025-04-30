import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params
  const url = await auth.providers[provider].getAuthUrl();
  return NextResponse.redirect(url);
}
