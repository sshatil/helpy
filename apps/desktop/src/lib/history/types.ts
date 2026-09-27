export type TaskExecutionHistory = {
  id: string;
  taskId: string;
  planId: string;
  taskTitle: string;
  plannedDuration: number;
  startedAt: string;
  completedAt: string;
  actualDuration: number;
};
