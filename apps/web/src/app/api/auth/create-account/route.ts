import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const res = await auth.createAccount(body);
  return NextResponse.json(res);
}