import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateTaskRequest } from "@/types/pipeline";
import { checkProjectAccess, handleApiError } from "@/lib/route-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body: CreateTaskRequest = await request.json();
    const { error } = await checkProjectAccess(projectId);

    if (error) return error;

    // If pipelineId is provided, verify it belongs to the project
    if (body.pipelineId) {
      const pipeline = await prisma.pipeline.findFirst({
        where: {
          id: body.pipelineId,
          projectId,
          isActive: true,
        },
      });

      if (!pipeline) {
        return NextResponse.json(
          { error: "Invalid pipeline" },
          { status: 400 }
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        points: body.points,
        projectId,
        pipelineId: body.pipelineId,
        assigneeId: body.assigneeId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        pipeline: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    return handleApiError(error, "Failed to create task");
  }
}
