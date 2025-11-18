"use client";

import { useState } from "react";
import { Pipeline, Task } from "@/types/pipeline";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { TaskCard } from "@/components/task/TaskCard";
import { CreateTaskDialog } from "@/components/task/CreateTaskDialog";
import { TaskDetailsDialog } from "@/components/task/TaskDetailsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PipelineColumnProps {
  pipeline: Pipeline;
  projectId: string;
  onTaskUpdate: () => void;
}

export function PipelineColumn({
  pipeline,
  projectId,
  onTaskUpdate,
}: PipelineColumnProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleTaskCreated = () => {
    onTaskUpdate();
    setIsCreateDialogOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsDialogOpen(true);
  };

  const handleTaskUpdated = () => {
    onTaskUpdate();
    setIsDetailsDialogOpen(false);
  };

  const totalPoints = pipeline.tasks.reduce(
    (sum, task) => sum + (task.points || 0),
    0
  );

  return (
    <div className="flex-shrink-0 w-80 bg-muted/60 rounded-lg h-full flex flex-col">
      {/* Column Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{pipeline.name}</h3>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 text-primary" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Pipeline</DropdownMenuItem>
                <DropdownMenuItem>Delete Pipeline</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {pipeline.tasks.length} Tasks / {totalPoints} Points
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {pipeline.tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h4 className="text-lg font-medium text-muted-foreground mb-2">
                {pipeline.name}
              </h4>
              <p className="text-sm text-muted-foreground max-w-48">
                {pipeline.description || "Tasks that need to be done"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pipeline.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onUpdate={onTaskUpdate}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateTaskDialog
        projectId={projectId}
        pipelineId={pipeline.id}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleTaskCreated}
      />

      <TaskDetailsDialog
        task={selectedTask}
        projectId={projectId}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedTask(null);
        }}
        onSuccess={handleTaskUpdated}
      />
    </div>
  );
}
