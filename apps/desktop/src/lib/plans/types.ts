export type Plan = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskStatus = 'ready' | 'running' | 'paused' | 'completed';

export type Task = {
  id: string;
  planId: string;
  title: string;
  duration: number;
  notes?: string;
  links: string[];
  order: number;
  completed: boolean;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type TaskExecution = {
  taskId: string;
  status: TaskStatus;
  startedAt: string;
  endAt?: string;
  remainingSeconds: number;
  updatedAt: string;
};
