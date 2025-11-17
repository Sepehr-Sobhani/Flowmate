import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateTaskRequest } from "@/types/pipeline";
import { checkProjectAccess, handleApiError } from "@/lib/route-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id: projectId, taskId } = await params;
    const body: UpdateTaskRequest = await request.json();
    const accessResult = await checkProjectAccess(projectId, true);

    if (accessResult.error) return accessResult.error;

    // Verify the task belongs to the project
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

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

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.points !== undefined && {
          points: body.points === null ? null : body.points,
        }),
        ...(body.pipelineId !== undefined && { pipelineId: body.pipelineId }),
        ...(body.assigneeId !== undefined && { assigneeId: body.assigneeId }),
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
    return handleApiError(error, "Failed to update task");
  }
}
