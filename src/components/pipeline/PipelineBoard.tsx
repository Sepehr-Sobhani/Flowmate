"use client";

import { Pipeline } from "@/types/pipeline";
import { PipelineColumn } from "./PipelineColumn";
import { Settings } from "lucide-react";

interface PipelineBoardProps {
  projectId: string;
  pipelines: Pipeline[];
  onPipelineUpdate: () => void;
}

export function PipelineBoard({
  projectId,
  pipelines,
  onPipelineUpdate,
}: PipelineBoardProps) {
  if (pipelines.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No pipelines available
              </h3>
              <p className="text-muted-foreground">
                Pipelines will be created automatically for this project.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Pipeline Board */}
      <div className="flex space-x-2 overflow-x-auto h-full pb-2">
        {pipelines.map((pipeline) => (
          <PipelineColumn
            key={pipeline.id}
            pipeline={pipeline}
            projectId={projectId}
            onTaskUpdate={onPipelineUpdate}
          />
        ))}
      </div>
    </div>
  );
}
