"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task } from "@/types/pipeline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTask } from "@/hooks/use-task-mutations";
import { toast } from "sonner";
import { Edit, Save, X, Clock, User } from "lucide-react";

const FIBONACCI_POINTS = [1, 2, 3, 5, 8, 13] as const;

const updateTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  points: z
    .union([z.enum(["1", "2", "3", "5", "8", "13"]), z.literal("none")])
    .optional(),
});

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

interface TaskDetailsDialogProps {
  task: Task | null;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TaskDetailsDialog({
  task,
  projectId,
  isOpen,
  onClose,
  onSuccess,
}: TaskDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateTaskMutation = useUpdateTask(projectId);

  const form = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      points: "none",
    },
  });

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (task && isOpen) {
      const pointsValue: "1" | "2" | "3" | "5" | "8" | "13" | "none" =
        task.points && FIBONACCI_POINTS.includes(task.points as any)
          ? (task.points.toString() as "1" | "2" | "3" | "5" | "8" | "13")
          : "none";

      form.reset({
        title: task.title,
        description: task.description || "",
        points: pointsValue,
      });
    }
  }, [task, isOpen, form]);

  const handleFormSubmit = async (data: UpdateTaskFormData) => {
    if (!task) return;

    try {
      // Convert "none" or undefined to null to clear points, otherwise convert string to number
      const pointsValue =
        data.points === "none" || data.points === undefined
          ? null
          : Number(data.points);

      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        data: {
          title: data.title,
          description: data.description || undefined,
          points: pointsValue,
        },
      });

      toast.success("Task updated", {
        description: "Your task has been updated successfully.",
      });

      setIsEditing(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error", {
        description: "Failed to update task. Please try again.",
      });
    }
  };

  const handleClose = () => {
    if (isEditing) {
      handleCancel();
    } else {
      form.reset();
    }
    setIsEditing(false);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      // Reset editing state when dialog opens
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (task) {
      const pointsValue: "1" | "2" | "3" | "5" | "8" | "13" | "none" =
        task.points && FIBONACCI_POINTS.includes(task.points as any)
          ? (task.points.toString() as "1" | "2" | "3" | "5" | "8" | "13")
          : "none";

      form.reset({
        title: task.title,
        description: task.description || "",
        points: pointsValue,
      });
    }
    setIsEditing(false);
  };

  if (!task) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[600px]"
        onOpenAutoFocus={(e) => {
          // Prevent default focus on close button
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Task Details"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the task details below."
              : "View task information and details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input placeholder="e.g., Fix login bug" {...field} />
                    ) : (
                      <div className="px-3 py-2 text-sm font-medium border rounded-md bg-muted/50">
                        {task.title}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Textarea
                        placeholder="Describe the task in detail..."
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    ) : (
                      <div className="px-3 py-2 text-sm border rounded-md bg-muted/50 min-h-[100px]">
                        {task.description || (
                          <span className="text-muted-foreground italic">
                            No description provided
                          </span>
                        )}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() ?? "none"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select points" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No points</SelectItem>
                          {FIBONACCI_POINTS.map((point) => (
                            <SelectItem key={point} value={point.toString()}>
                              {point}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="px-3 py-2">
                        {task.points ? (
                          <Badge variant="outline" className="text-sm">
                            {task.points} pts
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            No points assigned
                          </span>
                        )}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Read-only fields */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center space-x-2">
                  {task.assignee ? (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatarUrl || ""} />
                        <AvatarFallback className="text-xs">
                          {getInitials(
                            task.assignee.fullName || task.assignee.username
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {task.assignee.fullName || task.assignee.username}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {isEditing && (
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateTaskMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTaskMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>

        {!isEditing && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
