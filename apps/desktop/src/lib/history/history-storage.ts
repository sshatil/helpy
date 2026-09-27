import type { TaskExecutionHistory } from './types';

const HISTORY_STORAGE_KEY = 'productivity-task-execution-history';

export function getExecutionHistory(): TaskExecutionHistory[] {
  const stored = localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as TaskExecutionHistory[];
  } catch {
    localStorage.removeItem(HISTORY_STORAGE_KEY);

    return [];
  }
}

export function addExecutionHistory(
  history: TaskExecutionHistory,
): TaskExecutionHistory {
  const existing = getExecutionHistory();

  const updated = [history, ...existing];

  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));

  return history;
}

export function clearExecutionHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}
