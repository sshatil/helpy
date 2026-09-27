import {
  clearTaskExecution,
  getTaskExecution,
  setTaskExecution,
} from './execution-storage';

import { getTaskById, updateTask } from './task-storage';

import { queryClient } from '../query/query-client';
import { queryKeys } from '../query/query-keys';

import { handleTaskCompletion } from './task-completion';

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

function invalidateTasks(planId: string) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.tasks.all(planId),
  });
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

    setTaskExecution(execution);

    emit();
  }, 1000);
}

async function completeCurrentTask() {
  if (!execution) {
    return;
  }

  const currentExecution = execution;

  const taskId = currentExecution.taskId;

  const task = getTaskById(taskId);

  clearTimers();

  if (task) {
    updateTask(taskId, {
      status: 'completed',
      completed: true,
    });

    invalidateTasks(task.planId);

    completedTaskId = taskId;

    execution = undefined;

    clearTaskExecution();

    emit();

    await handleTaskCompletion(task, {
      ...currentExecution,
      remainingSeconds: 0,
      status: 'completed',
    });

    return;
  }

  execution = undefined;

  clearTaskExecution();

  emit();
}

function ensureExecutionIsValid() {
  if (!execution) {
    return;
  }

  if (execution.status !== 'running' || !execution.endAt) {
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
  };

  updateSnapshot();

  scheduleCompletion();
}

function startTask(task: Task) {
  if (task.completed) {
    return;
  }

  clearTimers();

  const durationSeconds = Math.max(0, task.duration * 60);

  if (durationSeconds <= 0) {
    return;
  }

  if (
    execution &&
    execution.taskId !== task.id &&
    execution.status === 'running'
  ) {
    const remaining = getRemainingSeconds(execution);

    const previousTask = getTaskById(execution.taskId);

    if (previousTask) {
      updateTask(execution.taskId, {
        status: 'paused',
        completed: false,
      });

      invalidateTasks(previousTask.planId);
    }

    execution = {
      ...execution,
      status: 'paused',
      remainingSeconds: remaining,
      endAt: undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  completedTaskId = undefined;

  const now = Date.now();

  const startedAt = new Date().toISOString();

  execution = {
    taskId: task.id,
    status: 'running',
    startedAt,
    remainingSeconds: durationSeconds,
    endAt: new Date(now + durationSeconds * 1000).toISOString(),
    updatedAt: startedAt,
  };

  updateTask(task.id, {
    status: 'running',
    completed: false,
  });

  invalidateTasks(task.planId);

  persist();

  emit();

  scheduleCompletion();
}

function pauseTask() {
  if (!execution || execution.status !== 'running') {
    return;
  }

  const remaining = getRemainingSeconds(execution);

  const task = getTaskById(execution.taskId);

  clearTimers();

  execution = {
    ...execution,
    status: 'paused',
    remainingSeconds: remaining,
    endAt: undefined,
    updatedAt: new Date().toISOString(),
  };

  persist();

  if (task) {
    updateTask(execution.taskId, {
      status: 'paused',
      completed: false,
    });

    invalidateTasks(task.planId);
  }

  emit();
}

function resumeTask() {
  if (!execution || execution.status !== 'paused') {
    return;
  }

  if (execution.remainingSeconds <= 0) {
    return;
  }

  const task = getTaskById(execution.taskId);

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

  if (task) {
    updateTask(execution.taskId, {
      status: 'running',
      completed: false,
    });

    invalidateTasks(task.planId);
  }

  emit();

  scheduleCompletion();
}

function stopTask() {
  if (!execution) {
    return;
  }

  const taskId = execution.taskId;

  const task = getTaskById(taskId);

  clearTimers();

  execution = undefined;

  clearTaskExecution();

  completedTaskId = undefined;

  if (task) {
    updateTask(taskId, {
      status: 'ready',
      completed: false,
    });

    invalidateTasks(task.planId);
  }

  emit();
}

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

  if (execution?.taskId === taskId) {
    execution = undefined;

    clearTaskExecution();
  }

  updateTask(taskId, {
    status: 'ready',
    completed: false,
  });

  invalidateTasks(task.planId);

  if (completedTaskId === taskId) {
    completedTaskId = undefined;
  }

  emit();
}

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

function getSnapshot(): ExecutionSnapshot {
  return snapshot;
}

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
