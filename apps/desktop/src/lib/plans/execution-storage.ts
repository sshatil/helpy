import type { TaskExecution } from './types';

const EXECUTION_STORAGE_KEY = 'productivity-task-execution';

export function getTaskExecution(): TaskExecution | undefined {
  const stored = localStorage.getItem(EXECUTION_STORAGE_KEY);

  if (!stored) {
    return undefined;
  }

  try {
    return JSON.parse(stored) as TaskExecution;
  } catch {
    localStorage.removeItem(EXECUTION_STORAGE_KEY);

    return undefined;
  }
}

export function setTaskExecution(execution: TaskExecution): void {
  localStorage.setItem(EXECUTION_STORAGE_KEY, JSON.stringify(execution));
}

export function clearTaskExecution(): void {
  localStorage.removeItem(EXECUTION_STORAGE_KEY);
}
