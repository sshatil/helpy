import { TaskExecutionHistory } from '../history/types';
import type { Plan } from '../plans/types';

function isSameDay(date: string, target: Date): boolean {
  const value = new Date(date);

  return (
    value.getFullYear() === target.getFullYear() &&
    value.getMonth() === target.getMonth() &&
    value.getDate() === target.getDate()
  );
}

export function getTodayHistory(
  history: TaskExecutionHistory[],
): TaskExecutionHistory[] {
  const today = new Date();

  return history.filter((item) => isSameDay(item.completedAt, today));
}

export function getTodayFocusMinutes(history: TaskExecutionHistory[]): number {
  return getTodayHistory(history).reduce(
    (total, item) => total + item.actualDuration,
    0,
  );
}

export function getTodayCompletedTasks(
  history: TaskExecutionHistory[],
): number {
  return getTodayHistory(history).length;
}

export function getTodayWorkedPlans(history: TaskExecutionHistory[]): number {
  return new Set(getTodayHistory(history).map((item) => item.planId)).size;
}

export function getCompletedTasks(history: TaskExecutionHistory[]): number {
  return history.length;
}

export function getTotalFocusMinutes(history: TaskExecutionHistory[]): number {
  return history.reduce((total, item) => total + item.actualDuration, 0);
}

export function getCompletedPlanIds(
  history: TaskExecutionHistory[],
): Set<string> {
  return new Set(history.map((item) => item.planId));
}

export function getCompletedPlans(
  plans: Plan[],
  history: TaskExecutionHistory[],
): number {
  const completedPlanIds = getCompletedPlanIds(history);

  return plans.filter((plan) => completedPlanIds.has(plan.id)).length;
}

export function formatFocusTime(minutes: number): string {
  if (minutes <= 0) {
    return '0 min';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatActivityTime(date: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatActivityDate(date: string): string {
  const value = new Date(date);
  const today = new Date();

  if (isSameDay(date, today)) {
    return `Today, ${formatActivityTime(date)}`;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, yesterday)) {
    return `Yesterday, ${formatActivityTime(date)}`;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value);
}
