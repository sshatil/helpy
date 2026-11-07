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

  /**
   * True when this date belongs to the actual
   * displayed range.
   */
  isInRange: boolean;

  /**
   * True when this date belongs to the month
   * represented by the calendar's first range date.
   */
  isCurrentMonth: boolean;
};

export type ActivityCalendarWeek = ActivityCalendarDay[];

/**
 * Creates the activity calendar.
 *
 * Recent:
 * - Last 365 days including today.
 * - Starts directly from the first actual date.
 * - Does not add previous-month overflow days.
 * - Does not add future days.
 *
 * Selected year:
 * - January 1 through December 31.
 * - Starts directly from January 1.
 * - Ends directly on December 31.
 */
export function getActivityCalendar(
  history: TaskExecutionHistory[],
  year?: number,
): ActivityCalendarWeek[] {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  let firstDate: Date;
  let lastDate: Date;

  if (year !== undefined) {
    /*
     * Selected year.
     */
    firstDate = new Date(year, 0, 1);
    firstDate.setHours(0, 0, 0, 0);

    lastDate = new Date(year, 11, 31);
    lastDate.setHours(0, 0, 0, 0);
  } else {
    /*
     * Recent:
     *
     * 365 days including today.
     */
    firstDate = addDays(today, -364);
    lastDate = today;
  }

  const dailyActivity = getDailyActivity(history);

  const weeks: ActivityCalendarWeek[] = [];

  /*
   * Important:
   *
   * We intentionally start directly at firstDate.
   *
   * We do NOT use startOfWeek(firstDate).
   *
   * This prevents something like:
   *
   * Nov
   * □
   * □
   * □
   * □
   * □
   * □
   * ■
   *
   * when the actual range begins near the end of a week.
   */
  let currentDate = new Date(firstDate);

  let currentWeek: ActivityCalendarWeek = [];

  while (currentDate <= lastDate) {
    const dateKey = getDateKey(currentDate);

    const activity = dailyActivity.get(dateKey);

    const isInRange = currentDate >= firstDate && currentDate <= lastDate;

    const isCurrentMonth =
      currentDate.getMonth() === firstDate.getMonth() &&
      currentDate.getFullYear() === firstDate.getFullYear();

    currentWeek.push({
      date: dateKey,

      completedTasks: isInRange ? (activity?.completedTasks ?? 0) : 0,

      focusedMinutes: isInRange ? (activity?.focusedMinutes ?? 0) : 0,

      isInRange,

      isCurrentMonth,
    });

    /*
     * Every seven actual dates creates one column.
     *
     * The first column may contain fewer than seven
     * dates. This is intentional because we don't want
     * fake overflow dates before the selected range.
     */
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);

      currentWeek = [];
    }

    currentDate = addDays(currentDate, 1);
  }

  /*
   * Add the final partial week.
   */
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
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

/**
 * Returns the month labels displayed above the calendar.
 *
 * Example for a rolling year:
 *
 * Nov  Dec  Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct
 *
 * We intentionally show a maximum of 12 labels so that
 * the trailing partial month does not create a duplicate
 * month name.
 */
export function getMonthLabels(weeks: ActivityCalendarWeek[]): {
  label: string;
  column: number;
}[] {
  if (weeks.length === 0) {
    return [];
  }

  const firstDay = weeks[0]?.[0];

  if (!firstDay) {
    return [];
  }

  const labels: {
    label: string;
    column: number;
  }[] = [];

  const formatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
  });

  /*
   * The first column always represents the month
   * where the actual calendar range starts.
   */
  const firstDate = getDateFromKey(firstDay.date);

  labels.push({
    label: formatter.format(firstDate),
    column: 0,
  });

  /*
   * Walk through the months after the first month.
   */
  const cursor = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 1);

  /*
   * The calendar represents approximately one year,
   * so we don't need more than 12 month labels.
   */
  while (labels.length < 12) {
    /*
     * Find the first calendar day belonging to this month.
     */
    const monthStartKey = getDateKey(cursor);

    const column = weeks.findIndex((week) =>
      week.some((day) => day.date === monthStartKey),
    );

    if (column !== -1) {
      labels.push({
        label: formatter.format(cursor),
        column,
      });
    }

    /*
     * Stop once we've moved beyond the last
     * actual calendar date.
     */
    const lastWeek = weeks[weeks.length - 1];

    const lastDay = lastWeek[lastWeek.length - 1];

    if (!lastDay) {
      break;
    }

    const lastDate = getDateFromKey(lastDay.date);

    if (cursor > lastDate) {
      break;
    }

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return labels;
}

export function getActivityYears(history: TaskExecutionHistory[]): number[] {
  const currentYear = new Date().getFullYear();

  const years = new Set<number>();

  /*
   * Always include the current year.
   */
  years.add(currentYear);

  /*
   * Include every year represented by the history.
   */
  for (const item of history) {
    years.add(new Date(item.completedAt).getFullYear());
  }

  return Array.from(years).sort((a, b) => b - a);
}
