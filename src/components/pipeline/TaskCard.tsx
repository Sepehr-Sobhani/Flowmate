"use client";

import { Task } from "@/types/pipeline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

export function TaskCard({ task, onUpdate: _onUpdate }: TaskCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-primary line-clamp-2">
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                <DropdownMenuItem>Move to Stage</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Points */}
          {task.points && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {task.points} pts
              </Badge>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {task.assignee ? (
                <div className="flex items-center space-x-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={task.assignee.avatarUrl || ""} />
                    <AvatarFallback className="text-xs">
                      {getInitials(
                        task.assignee.fullName || task.assignee.username
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {task.assignee.fullName || task.assignee.username}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="text-xs">Unassigned</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
