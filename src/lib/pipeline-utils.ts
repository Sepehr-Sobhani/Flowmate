import { prisma } from "@/lib/prisma";

export async function createDefaultPipelines(projectId: string) {
  // Default pipelines for new projects
  const defaultPipelines = [
    {
      name: "To Do",
      description: "Tasks that need to be done",
      position: 0,
    },
    {
      name: "In Progress",
      description: "Tasks currently being worked on",
      position: 1,
    },
    {
      name: "Done",
      description: "Completed tasks",
      position: 2,
    },
  ];

  // Create multiple default pipelines
  const pipelines = await Promise.all(
    defaultPipelines.map((pipeline) =>
      prisma.pipeline.create({
        data: {
          name: pipeline.name,
          description: pipeline.description,
          projectId,
          position: pipeline.position,
        },
      })
    )
  );

  return pipelines;
}
