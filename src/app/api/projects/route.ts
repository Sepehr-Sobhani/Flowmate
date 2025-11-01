import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { projectCreateSchema } from "@/lib/validations/project";
import { createDefaultPipelines } from "@/lib/pipeline-utils";

async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  return await prisma.user.findFirst({
    where: { clerkId: userId },
  });
}

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(_request.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          {
            members: {
              some: { userId: user.id },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      visibility: project.visibility.toLowerCase(),
      isActive: project.isActive,
      isDefault: project.isDefault,
      githubRepoId: project.githubRepoId,
      githubRepoName: project.githubRepoName,
      githubRepoOwner: project.githubRepoOwner,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt?.toISOString() || null,
      memberCount: project._count.members,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = projectCreateSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        visibility: validatedData.visibility.toUpperCase() as
          | "PUBLIC"
          | "PRIVATE",
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    // Create default pipelines for the new project
    await createDefaultPipelines(project.id);

    const formattedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      visibility: project.visibility.toLowerCase(),
      isActive: project.isActive,
      isDefault: project.isDefault,
      githubRepoId: project.githubRepoId,
      githubRepoName: project.githubRepoName,
      githubRepoOwner: project.githubRepoOwner,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt?.toISOString() || null,
      memberCount: project._count.members,
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 422 }
      );
    }

    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
