import {
  clearTaskExecution,
  getTaskExecution,
  setTaskExecution,
} from './execution-storage';

import { getTaskById, updateTask } from './task-storage';

import type { Task, TaskExecution } from './types';

type Listener = () => void;

type ExecutionSnapshot = {
  execution?: TaskExecution;
  completedTaskId?: string;
};

const listeners = new Set<Listener>();

let execution: TaskExecution | undefined = getTaskExecution();

let completedTaskId: string | undefined;

let snapshot: ExecutionSnapshot = {
  execution,
  completedTaskId,
};

let interval: ReturnType<typeof setInterval> | undefined;

let completionTimeout: ReturnType<typeof setTimeout> | undefined;

/*
 * Keep the snapshot reference stable.
 *
 * useSyncExternalStore() relies on this.
 */
function updateSnapshot() {
  snapshot = {
    execution,
    completedTaskId,
  };
}

function emit() {
  updateSnapshot();

  listeners.forEach((listener) => {
    listener();
  });
}

function persist() {
  if (execution) {
    setTaskExecution(execution);
  } else {
    clearTaskExecution();
  }
}

function getRemainingSeconds(currentExecution: TaskExecution): number {
  if (currentExecution.status !== 'running' || !currentExecution.endAt) {
    return Math.max(0, currentExecution.remainingSeconds);
  }

  return Math.max(
    0,
    Math.ceil((new Date(currentExecution.endAt).getTime() - Date.now()) / 1000),
  );
}

function clearTimers() {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }

  if (completionTimeout) {
    clearTimeout(completionTimeout);

    completionTimeout = undefined;
  }
}

function scheduleCompletion() {
  clearTimers();

  if (!execution || execution.status !== 'running' || !execution.endAt) {
    return;
  }

  const endTime = new Date(execution.endAt).getTime();

  const delay = Math.max(0, endTime - Date.now());

  completionTimeout = setTimeout(() => {
    void completeCurrentTask();
  }, delay);

  interval = setInterval(() => {
    if (!execution || execution.status !== 'running') {
      clearTimers();
      return;
    }

    const remaining = getRemainingSeconds(execution);

    if (remaining <= 0) {
      void completeCurrentTask();
      return;
    }

    execution = {
      ...execution,
      remainingSeconds: remaining,
      updatedAt: new Date().toISOString(),
    };

    /*
     * Keep storage updated while running.
     */
    setTaskExecution(execution);

    emit();
  }, 1000);
}

async function completeCurrentTask() {
  if (!execution) {
    return;
  }

  const taskId = execution.taskId;

  const task = getTaskById(taskId);

  clearTimers();

  if (task) {
    updateTask(taskId, {
      status: 'completed',
      completed: true,
    });

    /*
     * Memory-only completion state.
     *
     * This allows the current page to show:
     *
     * 00:00
     * Task completed
     * Reset
     * Next Task
     *
     * It is intentionally NOT persisted.
     */
    completedTaskId = taskId;
  }

  /*
   * There is no active timer anymore.
   */
  execution = undefined;

  clearTaskExecution();

  emit();

  /*
   * Notification can be enabled later:
   *
   * if (task) {
   *   await sendTaskCompletionNotification(
   *     task.title,
   *   );
   * }
   */
}

function ensureExecutionIsValid() {
  if (!execution) {
    return;
  }

  if (execution.status !== 'running' || !execution.endAt) {
    return;
  }

  const remaining = getRemainingSeconds(execution);

  /*
   * Timer finished while the app was
   * closed/backgrounded.
   */
  if (remaining <= 0) {
    void completeCurrentTask();
    return;
  }

  /*
   * Recalculate remaining time from endAt.
   */
  execution = {
    ...execution,
    remainingSeconds: remaining,
  };

  /*
   * Make the initial snapshot match
   * the restored execution.
   */
  updateSnapshot();

  scheduleCompletion();
}

function startTask(task: Task) {
  /*
   * Completed tasks cannot be started.
   */
  if (task.completed) {
    return;
  }

  clearTimers();

  const durationSeconds = Math.max(0, task.duration * 60);

  if (durationSeconds <= 0) {
    return;
  }

  /*
   * If another task is currently running,
   * pause it first.
   */
  if (
    execution &&
    execution.taskId !== task.id &&
    execution.status === 'running'
  ) {
    const remaining = getRemainingSeconds(execution);

    updateTask(execution.taskId, {
      status: 'paused',
      completed: false,
    });

    execution = {
      ...execution,
      status: 'paused',
      remainingSeconds: remaining,
      endAt: undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  /*
   * Starting a task removes the temporary
   * completed state.
   */
  completedTaskId = undefined;

  const now = Date.now();

  execution = {
    taskId: task.id,
    status: 'running',
    remainingSeconds: durationSeconds,
    endAt: new Date(now + durationSeconds * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  updateTask(task.id, {
    status: 'running',
    completed: false,
  });

  persist();

  emit();

  scheduleCompletion();
}

function pauseTask() {
  if (!execution || execution.status !== 'running') {
    return;
  }

  const remaining = getRemainingSeconds(execution);

  clearTimers();

  execution = {
    ...execution,
    status: 'paused',
    remainingSeconds: remaining,
    endAt: undefined,
    updatedAt: new Date().toISOString(),
  };

  persist();

  updateTask(execution.taskId, {
    status: 'paused',
    completed: false,
  });

  emit();
}

function resumeTask() {
  if (!execution || execution.status !== 'paused') {
    return;
  }

  if (execution.remainingSeconds <= 0) {
    return;
  }

  const endAt = new Date(
    Date.now() + execution.remainingSeconds * 1000,
  ).toISOString();

  execution = {
    ...execution,
    status: 'running',
    endAt,
    updatedAt: new Date().toISOString(),
  };

  persist();

  updateTask(execution.taskId, {
    status: 'running',
    completed: false,
  });

  emit();

  scheduleCompletion();
}

function stopTask() {
  if (!execution) {
    return;
  }

  const taskId = execution.taskId;

  clearTimers();

  execution = undefined;

  clearTaskExecution();

  completedTaskId = undefined;

  updateTask(taskId, {
    status: 'ready',
    completed: false,
  });

  emit();
}

/*
 * Reset a task by task ID.
 *
 * This works even after the timer has completed
 * because completed execution is no longer stored
 * in `execution`.
 */
function resetTask(taskId: string) {
  const task = getTaskById(taskId);

  if (!task) {
    if (completedTaskId === taskId) {
      completedTaskId = undefined;

      emit();
    }

    return;
  }

  clearTimers();

  /*
   * If this task owns the active timer,
   * remove that timer.
   */
  if (execution?.taskId === taskId) {
    execution = undefined;

    clearTaskExecution();
  }

  updateTask(taskId, {
    status: 'ready',
    completed: false,
  });

  if (completedTaskId === taskId) {
    completedTaskId = undefined;
  }

  emit();
}

/*
 * Used when the user clicks "Next Task"
 * or when the plan page unmounts.
 */
function clearCompletedTask() {
  if (!completedTaskId) {
    return;
  }

  completedTaskId = undefined;

  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/*
 * IMPORTANT:
 *
 * Do not return a newly-created object here.
 * Always return the same snapshot reference
 * until emit() changes it.
 */
function getSnapshot(): ExecutionSnapshot {
  return snapshot;
}

/*
 * Restore an active timer when the app starts.
 */
ensureExecutionIsValid();

export const executionStore = {
  subscribe,
  getSnapshot,
  startTask,
  pauseTask,
  resumeTask,
  stopTask,
  resetTask,
  clearCompletedTask,
};
