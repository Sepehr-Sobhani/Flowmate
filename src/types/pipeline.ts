export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  points?: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  pipelineId?: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

export interface CreatePipelineRequest {
  name: string;
  description?: string;
  projectId: string;
}

export interface UpdatePipelineRequest {
  name?: string;
  description?: string;
  position?: number;
  isActive?: boolean;
}

export interface CreatePipelineStageRequest {
  name: string;
  description?: string;
  color?: string;
  pipelineId: string;
  position?: number;
}

export interface UpdatePipelineStageRequest {
  name?: string;
  description?: string;
  color?: string;
  position?: number;
  isActive?: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  points?: number;
  projectId: string;
  pipelineId?: string;
  assigneeId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  points?: number;
  pipelineId?: string;
  assigneeId?: string;
}
