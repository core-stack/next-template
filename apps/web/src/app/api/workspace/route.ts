import { withAuth } from "@/lib/auth";
import { workspaceSchema } from "@/validation/workspace";
import { prisma } from "@packages/prisma";
import { NextResponse } from "next/server";

export const GET = withAuth(async (_, session) => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id
        }
      }
    },
    include: { members: true }
  });

  return NextResponse.json(workspaces);
});

export const POST = withAuth(async (req, session) => {
  const data = workspaceSchema.parse(await req.json());
  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      backgroundImage: data.backgroundColor || data.backgroundGradient || "",
      members: {
        create: {
          owner: true,
          role: "WORKSPACE_ADMIN",
          user: {
            connect: {
              id: session.user.id
            }
          }
        }
      }
    }
  });

  return NextResponse.json(session);
});