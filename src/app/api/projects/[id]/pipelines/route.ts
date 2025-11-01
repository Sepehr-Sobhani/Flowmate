import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreatePipelineRequest } from "@/types/pipeline";
// Remove unused import
import { checkProjectAccess, handleApiError } from "@/lib/route-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { error } = await checkProjectAccess(projectId);

    if (error) return error;

    const pipelines = await prisma.pipeline.findMany({
      where: {
        projectId,
        isActive: true,
      },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ pipelines });
  } catch (error) {
    return handleApiError(error, "Failed to fetch pipelines");
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body: CreatePipelineRequest = await request.json();
    const { error } = await checkProjectAccess(projectId, true);

    if (error) return error;

    // Get the next position
    const lastPipeline = await prisma.pipeline.findFirst({
      where: { projectId },
      orderBy: { position: "desc" },
    });

    const pipeline = await prisma.pipeline.create({
      data: {
        name: body.name,
        description: body.description,
        projectId,
        position: (lastPipeline?.position || 0) + 1,
      },
    });

    const pipelineWithTasks = await prisma.pipeline.findUnique({
      where: { id: pipeline.id },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ pipeline: pipelineWithTasks });
  } catch (error) {
    return handleApiError(error, "Failed to create pipeline");
  }
}
