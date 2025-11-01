import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Pipeline } from "@/types/pipeline";

export function usePipelines(projectId: string) {
  return useSuspenseQuery<Pipeline[]>({
    queryKey: ["pipelines", projectId],
    queryFn: () => api.pipelines.getByProjectId(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
