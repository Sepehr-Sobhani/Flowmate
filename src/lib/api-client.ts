import type { ProjectCreateInput } from "@/lib/validations/project";
import type { Project } from "@/types/api-common";
import type { Pipeline } from "@/types/pipeline";
import type { Task } from "@/types/pipeline";

export async function handleAuthError(response: Response): Promise<boolean> {
  if (response.status === 401) {
    // Redirect to login if we're not already there
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.href = "/";
    }

    return true;
  }
  return false;
}

// Common headers for JSON requests
const HEADERS = {
  "Content-Type": "application/json",
};

async function handleResponse<T>(
  response: Response,
  errorMessage: string
): Promise<T> {
  if (!response.ok) {
    if (await handleAuthError(response)) {
      throw new Error("Authentication required");
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const api = {
  projects: {
    getAll: async (): Promise<Project[]> => {
      const response = await fetch("/api/projects");
      return handleResponse<Project[]>(response, "Failed to fetch projects");
    },
    getById: async (id: string): Promise<Project> => {
      const response = await fetch(`/api/projects/${id}`);
      return handleResponse<Project>(response, "Failed to fetch project");
    },
    create: async (data: ProjectCreateInput): Promise<Project> => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data),
      });
      return handleResponse<Project>(response, "Failed to create project");
    },
  },
  pipelines: {
    getByProjectId: async (projectId: string): Promise<Pipeline[]> => {
      const response = await fetch(`/api/projects/${projectId}/pipelines`);
      const data = await handleResponse<{ pipelines?: Pipeline[] }>(
        response,
        "Failed to fetch pipelines"
      );
      return data.pipelines || [];
    },
  },
  tasks: {
    create: async (
      projectId: string,
      data: {
        title: string;
        description?: string;
        pipelineId?: string;
      }
    ): Promise<Task> => {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data),
      });
      const result = await handleResponse<{ task: Task }>(
        response,
        "Failed to create task"
      );
      return result.task;
    },
    update: async (
      projectId: string,
      taskId: string,
      data: {
        title?: string;
        description?: string;
        points?: number | null;
        pipelineId?: string;
        assigneeId?: string;
      }
    ): Promise<Task> => {
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: HEADERS,
          body: JSON.stringify(data),
        }
      );
      const result = await handleResponse<{ task: Task }>(
        response,
        "Failed to update task"
      );
      return result.task;
    },
    delete: async (projectId: string, taskId: string): Promise<void> => {
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: HEADERS,
        }
      );
      await handleResponse<{ success: boolean }>(
        response,
        "Failed to delete task"
      );
    },
  },
};

export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(url);
    return handleResponse(response, `Failed to fetch: ${response.statusText}`);
  },
  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(data),
    });
    return handleResponse(response, `Failed to post: ${response.statusText}`);
  },
  put: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(data),
    });
    return handleResponse(response, `Failed to put: ${response.statusText}`);
  },
  delete: async (url: string) => {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return handleResponse(response, `Failed to delete: ${response.statusText}`);
  },
};
