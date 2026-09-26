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

  /**
   * When running, this is the exact timestamp
   * at which the timer should reach zero.
   */
  endAt?: string;

  /**
   * Used while paused.
   *
   * We don't need endAt while paused because
   * the timer is no longer moving.
   */
  remainingSeconds: number;

  updatedAt: string;
};
