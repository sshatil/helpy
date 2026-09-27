import { useCallback, useSyncExternalStore } from 'react';
import { Task } from '../lib/plans/types';
import { executionStore } from '../lib/plans/execution-store';

function getRemainingSeconds(
  task: Task,
  execution:
    ReturnType<typeof executionStore.getSnapshot>['execution'] | undefined,
) {
  if (!execution || execution.taskId !== task.id) {
    return Math.max(0, task.duration * 60);
  }

  if (execution.status !== 'running' || !execution.endAt) {
    return Math.max(0, execution.remainingSeconds);
  }

  return Math.max(
    0,
    Math.ceil((new Date(execution.endAt).getTime() - Date.now()) / 1000),
  );
}

/**
 * Shared runtime execution snapshot.
 *
 * This is the single source of truth for:
 * - currently running task
 * - paused task
 * - completed task
 */
export function useExecutionSnapshot() {
  return useSyncExternalStore(
    executionStore.subscribe,
    executionStore.getSnapshot,
    executionStore.getSnapshot,
  );
}

export function useTaskExecution(task: Task) {
  const snapshot = useExecutionSnapshot();

  const execution = snapshot.execution;

  const isJustCompleted = snapshot.completedTaskId === task.id;

  const isCurrentTask = execution?.taskId === task.id;

  const status = isJustCompleted
    ? 'completed'
    : task.completed
      ? 'completed'
      : isCurrentTask
        ? execution.status
        : task.status;

  const remainingSeconds = isJustCompleted
    ? 0
    : getRemainingSeconds(task, execution);

  const start = useCallback(() => {
    executionStore.startTask(task);
  }, [task]);

  const pause = useCallback(() => {
    executionStore.pauseTask();
  }, []);

  const resume = useCallback(() => {
    executionStore.resumeTask();
  }, []);

  const stop = useCallback(() => {
    executionStore.stopTask();
  }, []);

  const reset = useCallback(() => {
    executionStore.resetTask(task.id);
  }, [task.id]);

  return {
    status,
    remainingSeconds,
    isCurrentTask,
    isJustCompleted,

    start,
    pause,
    resume,
    stop,
    reset,
  };
}
