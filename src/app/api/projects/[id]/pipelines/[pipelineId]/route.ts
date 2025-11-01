import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdatePipelineRequest } from "@/types/pipeline";
import { checkProjectAccess } from "@/lib/route-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pipelineId: string }> }
) {
  try {
    const { id: projectId, pipelineId } = await params;
    const { error } = await checkProjectAccess(projectId);

    if (error) return error;

    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: pipelineId,
        projectId,
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
    });

    if (!pipeline) {
      return NextResponse.json(
        { error: "Pipeline not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ pipeline });
  } catch (error) {
    console.error("Error fetching pipeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch pipeline" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pipelineId: string }> }
) {
  try {
    const { id: projectId, pipelineId } = await params;
    const body: UpdatePipelineRequest = await request.json();
    const { error } = await checkProjectAccess(projectId, true);

    if (error) return error;

    const pipeline = await prisma.pipeline.update({
      where: {
        id: pipelineId,
        projectId,
      },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.position !== undefined && { position: body.position }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
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
    });

    return NextResponse.json({ pipeline });
  } catch (error) {
    console.error("Error updating pipeline:", error);
    return NextResponse.json(
      { error: "Failed to update pipeline" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pipelineId: string }> }
) {
  try {
    const { id: projectId, pipelineId } = await params;
    const { error } = await checkProjectAccess(projectId, true);

    if (error) return error;

    // Soft delete by setting isActive to false
    await prisma.pipeline.update({
      where: {
        id: pipelineId,
        projectId,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pipeline:", error);
    return NextResponse.json(
      { error: "Failed to delete pipeline" },
      { status: 500 }
    );
  }
}
