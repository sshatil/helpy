import type { TaskExecutionHistory } from '../history/types';

export type DailyActivity = {
  date: string;
  completedTasks: number;
  focusedMinutes: number;
};

function getDateKey(date: string | Date): string {
  const value = typeof date === 'string' ? new Date(date) : date;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number): Date {
  const result = new Date(date);

  result.setDate(result.getDate() + amount);

  return result;
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  result.setDate(result.getDate() - result.getDay());

  return result;
}

function endOfWeek(date: Date): Date {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  result.setDate(result.getDate() + (6 - result.getDay()));

  return result;
}

export function getDailyActivity(
  history: TaskExecutionHistory[],
): Map<string, DailyActivity> {
  const activity = new Map<string, DailyActivity>();

  for (const item of history) {
    const date = getDateKey(item.completedAt);

    const existing = activity.get(date);

    if (existing) {
      existing.completedTasks += 1;
      existing.focusedMinutes += item.actualDuration;
      continue;
    }

    activity.set(date, {
      date,
      completedTasks: 1,
      focusedMinutes: item.actualDuration,
    });
  }

  return activity;
}

export type ActivityCalendarDay = {
  date: string;
  completedTasks: number;
  focusedMinutes: number;
  isCurrentMonth: boolean;
};

export type ActivityCalendarWeek = ActivityCalendarDay[];

export function getActivityCalendar(
  history: TaskExecutionHistory[],
  year?: number,
): ActivityCalendarWeek[] {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  let firstDate: Date;
  let lastDate: Date;

  if (year !== undefined) {
    // Year filter selected:
    // show the complete selected year.
    firstDate = new Date(year, 0, 1);
    firstDate.setHours(0, 0, 0, 0);

    lastDate = new Date(year, 11, 31);
    lastDate.setHours(0, 0, 0, 0);
  } else {
    // Default:
    // preserve the original behavior and show
    // the last 365 days ending today.
    firstDate = addDays(today, -364);
    lastDate = today;
  }

  const calendarStart = startOfWeek(firstDate);

  const calendarEnd = endOfWeek(lastDate);

  const dailyActivity = getDailyActivity(history);

  const weeks: ActivityCalendarWeek[] = [];

  let currentDate = calendarStart;

  while (currentDate <= calendarEnd) {
    const week: ActivityCalendarWeek = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const dateKey = getDateKey(currentDate);

      const activity = dailyActivity.get(dateKey);

      week.push({
        date: dateKey,
        completedTasks: activity?.completedTasks ?? 0,
        focusedMinutes: activity?.focusedMinutes ?? 0,
        isCurrentMonth:
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear(),
      });

      currentDate = addDays(currentDate, 1);
    }

    weeks.push(week);
  }

  return weeks;
}

export function getActivityLevel(completedTasks: number): 0 | 1 | 2 | 3 | 4 {
  if (completedTasks === 0) {
    return 0;
  }

  if (completedTasks === 1) {
    return 1;
  }

  if (completedTasks <= 3) {
    return 2;
  }

  if (completedTasks <= 5) {
    return 3;
  }

  return 4;
}

export function formatActivityDate(dateKey: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(getDateFromKey(dateKey));
}

export function formatActivityFocusTime(minutes: number): string {
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

export function getMonthLabels(weeks: ActivityCalendarWeek[]): {
  label: string;
  column: number;
}[] {
  if (weeks.length === 0) {
    return [];
  }

  const labels: {
    label: string;
    column: number;
  }[] = [];

  const firstDate = getDateFromKey(weeks[0][0].date);

  const lastWeek = weeks[weeks.length - 1];

  const lastDate = getDateFromKey(lastWeek[lastWeek.length - 1].date);

  const cursor = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);

  while (cursor <= lastDate) {
    const monthStart = new Date(cursor);

    const monthStartKey = getDateKey(monthStart);

    let column = -1;

    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex += 1) {
      const week = weeks[weekIndex];

      if (week.some((day) => day.date === monthStartKey)) {
        column = weekIndex;
        break;
      }
    }

    if (column !== -1) {
      labels.push({
        label: new Intl.DateTimeFormat(undefined, {
          month: 'short',
        }).format(monthStart),
        column,
      });
    }

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return labels;
}

export function getActivityYears(history: TaskExecutionHistory[]): number[] {
  const currentYear = new Date().getFullYear();

  const years = new Set<number>();

  years.add(currentYear);

  for (const item of history) {
    years.add(new Date(item.completedAt).getFullYear());
  }

  return Array.from(years).sort((a, b) => b - a);
}
