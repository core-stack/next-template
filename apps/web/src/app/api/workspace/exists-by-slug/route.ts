import { withAuth } from "@/lib/auth";
import { prisma } from "@packages/prisma";
import { NextResponse } from "next/server";

export const GET = withAuth(async (req) => {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Slug não informado' }, { status: 400 });
  const workspace = await prisma.workspace.findUnique({ where: { slug } });
  return NextResponse.json({ exists: !!workspace });
})