"use client";

import { useParams } from "next/navigation";
import { useProject } from "@/hooks/use-project";
import { usePipelines } from "@/hooks/use-pipelines";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";

interface ProjectContentProps {
  user: {
    id: string;
    username: string;
    fullName?: string;
  };
}

export function ProjectContent({}: ProjectContentProps) {
  const params = useParams();
  const projectId = params.id as string;

  const { data: project } = useProject(projectId);
  const { data: pipelines, refetch: refetchPipelines } =
    usePipelines(projectId);

  // Type assertion to help TypeScript understand the data structure
  const projectData = project as any;

  if (!projectData) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            {projectData.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(projectData.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
          {projectData.description && (
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              {projectData.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-primary/10 text-primary border border-primary/20">
            {projectData.visibility === "private" ? "Private" : "Public"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-border mb-6" />

      {/* Pipeline Board */}
      <PipelineBoard
        projectId={projectId}
        pipelines={pipelines}
        onPipelineUpdate={refetchPipelines}
      />
    </div>
  );
}
