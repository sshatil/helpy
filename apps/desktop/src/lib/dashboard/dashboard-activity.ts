import type { TaskExecutionHistory } from '../history/types';

export type DailyActivity = {
  date: string;
  completedTasks: number;
  focusedMinutes: number;
};

export type ActivityCalendarDay = {
  date: string;
  completedTasks: number;
  focusedMinutes: number;
  isCurrentMonth: boolean;
};

export type ActivityCalendarWeek = ActivityCalendarDay[];

export type ActivityCalendarRange = {
  startDate: Date;
  endDate: Date;
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

function startOfDay(date: Date): Date {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

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

/**
 * Returns the actual date range that the activity calendar represents.
 *
 * Recent:
 * - Last 365 days including today.
 *
 * Selected year:
 * - January 1 through December 31.
 */
export function getActivityCalendarRange(year?: number): ActivityCalendarRange {
  const today = startOfDay(new Date());

  if (year !== undefined) {
    return {
      startDate: new Date(year, 0, 1),
      endDate: new Date(year, 11, 31),
    };
  }

  return {
    startDate: addDays(today, -364),
    endDate: today,
  };
}

export function getActivityCalendar(
  history: TaskExecutionHistory[],
  year?: number,
): ActivityCalendarWeek[] {
  const today = startOfDay(new Date());

  const { startDate, endDate } = getActivityCalendarRange(year);

  const calendarStart = startOfWeek(startDate);
  const calendarEnd = endOfWeek(endDate);

  const dailyActivity = getDailyActivity(history);

  const weeks: ActivityCalendarWeek[] = [];

  let currentDate = calendarStart;

  while (currentDate <= calendarEnd) {
    const week: ActivityCalendarWeek = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const dateKey = getDateKey(currentDate);
      const activity = dailyActivity.get(dateKey);

      const isInCurrentMonth =
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      week.push({
        date: dateKey,
        completedTasks: activity?.completedTasks ?? 0,
        focusedMinutes: activity?.focusedMinutes ?? 0,
        isCurrentMonth: isInCurrentMonth,
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

export function getMonthLabels(
  weeks: ActivityCalendarWeek[],
  startDate: Date,
  endDate: Date,
): {
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

  const formatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
  });

  const displayedMonths = new Set<string>();

  const firstMonth = formatter.format(startDate);

  labels.push({
    label: firstMonth,
    column: 0,
  });

  displayedMonths.add(firstMonth);

  /*
   * Start from the following month.
   */
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

  while (cursor <= endDate) {
    const label = formatter.format(cursor);

    /*
     * Don't show the same month name twice.
     *
     * This removes the second "Oct" at the end
     * of the rolling calendar.
     */
    if (!displayedMonths.has(label)) {
      const monthStartKey = getDateKey(cursor);

      const column = weeks.findIndex((week) =>
        week.some((day) => day.date === monthStartKey),
      );

      if (column !== -1) {
        labels.push({
          label,
          column,
        });

        displayedMonths.add(label);
      }
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
