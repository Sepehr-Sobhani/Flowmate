import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

interface CreateTaskInput {
  title: string;
  description?: string;
  pipelineId?: string;
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => api.tasks.create(projectId, data),
    onSuccess: () => {
      // Invalidate pipelines query to refetch with the new task
      queryClient.invalidateQueries({ queryKey: ["pipelines", projectId] });
    },
  });
}
