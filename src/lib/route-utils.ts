import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ProjectAccessResult {
  user: any;
  project: any;
  error?: NextResponse;
}

export async function checkProjectAccess(
  projectId: string,
  requireAdmin = false
): Promise<ProjectAccessResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      user: null,
      project: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const dbUser = await prisma.user.findFirst({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    return {
      user: null,
      project: null,
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
    };
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: dbUser.id },
        {
          members: {
            some: {
              userId: dbUser.id,
              ...(requireAdmin && { role: { in: ["OWNER", "ADMIN"] } }),
            },
          },
        },
      ],
    },
  });

  if (!project) {
    return {
      user: null,
      project: null,
      error: NextResponse.json({ error: "Project not found" }, { status: 404 }),
    };
  }

  return {
    user: { id: dbUser.id },
    project,
  };
}

export function handleApiError(error: any, message: string) {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
}
