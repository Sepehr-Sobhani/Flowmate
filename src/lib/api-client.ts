import type { ProjectCreateInput } from "@/lib/validations/project";

// Helper function to get auth headers for client-side requests
export function getAuthHeaders(): Record<string, string> {
  // For client-side requests, Clerk handles auth via middleware
  return {};
}

// API client functions
export const api = {
  // Projects
  projects: {
    getAll: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        if (response.status === 401) {
          // Handle 401 by redirecting to login
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/"
          ) {
            window.location.href = "/";
          }
          throw new Error("Authentication required");
        }
        throw new Error("Failed to fetch projects");
      }
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) {
        if (response.status === 401) {
          // Handle 401 by redirecting to login
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/"
          ) {
            window.location.href = "/";
          }
          throw new Error("Authentication required");
        }
        throw new Error("Failed to fetch project");
      }
      return response.json();
    },
    create: async (data: ProjectCreateInput) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 401) {
          // Handle 401 by redirecting to login
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/"
          ) {
            window.location.href = "/";
          }
          throw new Error("Authentication required");
        }
        throw new Error("Failed to create project");
      }
      return response.json();
    },
  },
  // Pipelines
  pipelines: {
    getByProjectId: async (projectId: string) => {
      const response = await fetch(`/api/projects/${projectId}/pipelines`);
      if (!response.ok) {
        if (response.status === 401) {
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/"
          ) {
            window.location.href = "/";
          }
          throw new Error("Authentication required");
        }
        throw new Error("Failed to fetch pipelines");
      }
      const data = await response.json();
      return data.pipelines || [];
    },
  },
};

// Generic API client for making requests
export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
        throw new Error("Authentication required");
      }
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  },
  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
        throw new Error("Authentication required");
      }
      throw new Error(`Failed to post: ${response.statusText}`);
    }
    return response.json();
  },
  put: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
        throw new Error("Authentication required");
      }
      throw new Error(`Failed to put: ${response.statusText}`);
    }
    return response.json();
  },
  delete: async (url: string) => {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
        throw new Error("Authentication required");
      }
      throw new Error(`Failed to delete: ${response.statusText}`);
    }
    return response.json();
  },
};

// Helper function to handle 401 errors (kept for backward compatibility)
export async function handleAuthError(response: Response): Promise<boolean> {
  if (response.status === 401) {
    // Redirect to login if we're not already there
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.href = "/";
    }

    return true; // Indicates we handled the error
  }
  return false; // Error not handled
}
