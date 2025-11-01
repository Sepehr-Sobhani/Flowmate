"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  points: z.number().min(0).max(100).optional(),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskDialogProps {
  projectId: string;
  pipelineId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTaskDialog({
  projectId,
  pipelineId,
  isOpen,
  onClose,
  onSuccess,
}: CreateTaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      points: undefined,
    },
  });

  const handleFormSubmit = async (data: CreateTaskFormData) => {
    try {
      setIsLoading(true);

      await apiClient.post(`/projects/${projectId}/tasks`, {
        title: data.title,
        description: data.description || undefined,
        points: data.points || undefined,
        pipelineId: pipelineId || undefined,
      });

      toast.success("Task created", {
        description: "Your task has been created successfully.",
      });

      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error", {
        description: "Failed to create task. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(handleFormSubmit)(e);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task for your project. It will be added to the selected
            pipeline.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fix login bug" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the task in detail..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
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
                  <FormLabel>Story Points (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 5"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
