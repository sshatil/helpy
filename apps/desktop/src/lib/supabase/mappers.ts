import { TaskExecutionHistory } from '../history/types';
import type { Plan, Task, TaskStatus } from '../plans/types';

import type { HistoryRow, PlanRow, TaskRow } from './types';

function mapTaskStatus(status: string): TaskStatus {
  switch (status) {
    case 'ready':
    case 'running':
    case 'paused':
    case 'completed':
      return status;

    default:
      throw new Error(`Invalid task status received from Supabase: ${status}`);
  }
}

export function mapPlan(row: PlanRow): Plan {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    planId: row.plan_id,
    title: row.title,
    duration: row.duration,
    notes: row.notes ?? undefined,
    links: row.links ?? [],
    order: row.task_order,
    completed: row.completed,
    status: mapTaskStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapHistory(row: HistoryRow): TaskExecutionHistory {
  return {
    id: row.id,
    taskId: row.task_id,
    planId: row.plan_id,
    planTitle: row.plan_title,
    taskTitle: row.task_title,
    plannedDuration: row.planned_duration,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    actualDuration: row.actual_duration,
  };
}
