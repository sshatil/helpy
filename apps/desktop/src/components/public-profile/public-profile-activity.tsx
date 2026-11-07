import { Activity } from 'lucide-react';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';

export type PublicProfileActivityItem = {
  date: string;
  count: number;
  minutes: number;
};

type ActivityDay = PublicProfileActivityItem;

const ACTIVITY_LEVEL_CLASSES = {
  0: 'bg-muted',
  1: 'bg-primary/40',
  2: 'bg-primary/60',
  3: 'bg-primary/80',
  4: 'bg-primary',
} as const;

function formatFocusTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatDate(date: string): string {
  const value = new Date(`${date}T12:00:00`);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(value);
}

function getActivityLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) {
    return 0;
  }

  if (maxCount <= 1) {
    return 1;
  }

  const ratio = count / maxCount;

  if (ratio <= 0.25) {
    return 1;
  }

  if (ratio <= 0.5) {
    return 2;
  }

  if (ratio <= 0.75) {
    return 3;
  }

  return 4;
}

function getActivityWeeks(
  activity: PublicProfileActivityItem[],
): ActivityDay[][] {
  const activityMap = new Map(activity.map((item) => [item.date, item]));

  const today = new Date();

  today.setHours(12, 0, 0, 0);

  const dayOfWeek = today.getDay();

  /*
   * End the calendar on Saturday so every week
   * always contains Sunday → Saturday.
   */
  const endDate = new Date(today);

  endDate.setDate(endDate.getDate() + (6 - dayOfWeek));

  /*
   * 52 complete weeks.
   *
   * 52 × 7 = 364 days.
   */
  const startDate = new Date(endDate);

  startDate.setDate(startDate.getDate() - 363);

  const days: ActivityDay[] = [];

  for (
    let current = new Date(startDate);
    current <= endDate;
    current.setDate(current.getDate() + 1)
  ) {
    const date = [
      current.getFullYear(),
      String(current.getMonth() + 1).padStart(2, '0'),
      String(current.getDate()).padStart(2, '0'),
    ].join('-');

    const item = activityMap.get(date);

    days.push({
      date,
      count: item?.count ?? 0,
      minutes: item?.minutes ?? 0,
    });
  }

  const weeks: ActivityDay[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return weeks;
}

function getMonthLabels(weeks: ActivityDay[][]): {
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

  let previousMonthKey = '';

  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0];

    if (!firstDay) {
      return;
    }

    const date = new Date(`${firstDay.date}T12:00:00`);

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (monthKey === previousMonthKey) {
      return;
    }

    labels.push({
      label: new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(date),
      column: weekIndex,
    });

    previousMonthKey = monthKey;
  });

  return labels;
}

function ActivityLegend() {
  return (
    <div className='text-muted-foreground flex items-center gap-2 text-xs'>
      <span>Less</span>

      {([0, 1, 2, 3, 4] as const).map((level) => (
        <span
          key={level}
          className={[
            'size-3 rounded-[2px]',
            ACTIVITY_LEVEL_CLASSES[level],
          ].join(' ')}
        />
      ))}

      <span>More</span>
    </div>
  );
}

export function PublicProfileActivity({
  activity,
}: {
  activity: PublicProfileActivityItem[];
}) {
  const weeks = useMemo(() => getActivityWeeks(activity), [activity]);

  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const maxCount = Math.max(1, ...activity.map((item) => item.count));

  const totalCompletedTasks = activity.reduce(
    (total, item) => total + item.count,
    0,
  );

  const totalFocusMinutes = activity.reduce(
    (total, item) => total + item.minutes,
    0,
  );

  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0'>
            <CardTitle>Activity</CardTitle>

            <CardDescription>
              Task completion activity over the last year.
            </CardDescription>
          </div>

          <Activity className='text-muted-foreground hidden size-5 shrink-0 sm:block' />
        </div>
      </CardHeader>

      <CardContent>
        <div className='w-full'>
          {/* Month labels */}
          <div className='relative mb-2 h-5 w-full'>
            {monthLabels.map((month) => (
              <div
                key={`${month.label}-${month.column}`}
                className='text-muted-foreground absolute top-0 text-xs whitespace-nowrap'
                style={{
                  left:
                    weeks.length > 0
                      ? `${(month.column / weeks.length) * 100}%`
                      : '0%',
                }}
              >
                {month.label}
              </div>
            ))}
          </div>

          <TooltipProvider>
            <div
              className='grid w-full gap-x-1'
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
              }}
            >
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className='grid min-w-0 grid-rows-7 gap-1'>
                  {week.map((day) => {
                    const level = getActivityLevel(day.count, maxCount);

                    const label =
                      day.count === 0
                        ? `${formatDate(day.date)}: no completed tasks`
                        : `${formatDate(day.date)}: ${day.count} completed ${
                            day.count === 1 ? 'task' : 'tasks'
                          }`;

                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <button
                            type='button'
                            aria-label={`${label} · ${formatFocusTime(
                              day.minutes,
                            )} focused`}
                            className={[
                              'mx-auto aspect-square w-full max-w-4 rounded-[2px]',
                              'transition-opacity',
                              'hover:ring-ring hover:ring-2 hover:ring-offset-1',
                              ACTIVITY_LEVEL_CLASSES[level],
                            ].join(' ')}
                          />
                        </TooltipTrigger>

                        <TooltipContent>
                          <div className='space-y-1'>
                            <p className='font-medium'>
                              {formatDate(day.date)}
                            </p>

                            <p className='text-xs'>
                              {day.count} {day.count === 1 ? 'task' : 'tasks'}{' '}
                              completed
                            </p>

                            <p className='text-muted-foreground text-xs'>
                              {formatFocusTime(day.minutes)} focused
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Activity summary */}
        <div className='mt-6 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm'>
            {totalCompletedTasks} {totalCompletedTasks === 1 ? 'task' : 'tasks'}{' '}
            completed · {formatFocusTime(totalFocusMinutes)} focused
          </p>

          <ActivityLegend />
        </div>
      </CardContent>
    </Card>
  );
}
