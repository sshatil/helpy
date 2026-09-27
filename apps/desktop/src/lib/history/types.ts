export type TaskExecutionHistory = {
  id: string;
  taskId: string;
  planId: string;
  planTitle: string;
  taskTitle: string;
  plannedDuration: number;
  startedAt: string;
  completedAt: string;
  actualDuration: number;
};
