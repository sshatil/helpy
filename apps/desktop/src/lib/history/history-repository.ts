import {
  addExecutionHistory,
  clearExecutionHistory,
  getExecutionHistory,
} from './history-storage';

import type { TaskExecutionHistory } from './types';

export async function getAllExecutionHistory(): Promise<
  TaskExecutionHistory[]
> {
  return getExecutionHistory();
}

export async function createExecutionHistory(
  data: TaskExecutionHistory,
): Promise<TaskExecutionHistory> {
  return addExecutionHistory(data);
}

export async function clearAllExecutionHistory(): Promise<void> {
  clearExecutionHistory();
}
