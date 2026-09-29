import { queryClient } from '../query/query-client';
import { queryKeys } from '../query/query-keys';

import { createExecutionHistory } from '../history/history-repository';
import { getSettings } from '../settings/settings-storage';

import { sendTaskCompletionNotification } from '../notifications/task-notifications';

import { getPlanById } from './plan-storage';

import type { Task, TaskExecution } from './types';

export async function handleTaskCompletion(
  task: Task,
  execution: TaskExecution,
) {
  const completedAt = new Date().toISOString();

  const plannedDuration = task.duration;

  const actualSeconds = Math.max(
    0,
    plannedDuration * 60 - execution.remainingSeconds,
  );

  const actualDuration = Math.round(actualSeconds / 60);

  const plan = getPlanById(task.planId);

  await createExecutionHistory({
    id: crypto.randomUUID(),
    taskId: task.id,
    planId: task.planId,
    planTitle: plan?.title ?? 'Unknown plan',
    taskTitle: task.title,
    plannedDuration,
    startedAt: execution.startedAt,
    completedAt,
    actualDuration,
  });

  await queryClient.invalidateQueries({
    queryKey: queryKeys.history.all,
  });

  const settings = getSettings();

  if (settings.notifications.taskCompletion) {
    await sendTaskCompletionNotification(task.title);
  }
}
