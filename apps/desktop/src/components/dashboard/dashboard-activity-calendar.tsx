import { Activity } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';

import {
  formatActivityDate,
  formatActivityFocusTime,
  getActivityCalendar,
  getActivityLevel,
  getActivityYears,
  getMonthLabels,
} from '../../lib/dashboard/dashboard-activity';

import type { TaskExecutionHistory } from '../../lib/history/types';

type DashboardActivityCalendarProps = {
  history: TaskExecutionHistory[];
};

const ACTIVITY_LEVEL_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-muted',
  1: 'bg-primary/40',
  2: 'bg-primary/60',
  3: 'bg-primary/80',
  4: 'bg-primary',
};

export function DashboardActivityCalendar({
  history,
}: DashboardActivityCalendarProps) {
  const years = useMemo(() => getActivityYears(history), [history]);

  const [selectedYear, setSelectedYear] = useState<string>('all');

  const selectedYearNumber =
    selectedYear === 'all' ? undefined : Number(selectedYear);

  const weeks = useMemo(
    () => getActivityCalendar(history, selectedYearNumber),
    [history, selectedYearNumber],
  );

  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const filteredHistory = useMemo(() => {
    if (selectedYearNumber === undefined) {
      return history;
    }

    return history.filter(
      (item) => new Date(item.completedAt).getFullYear() === selectedYearNumber,
    );
  }, [history, selectedYearNumber]);

  const totalCompletedTasks = filteredHistory.length;

  const totalFocusMinutes = filteredHistory.reduce(
    (total, item) => total + item.actualDuration,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0'>
            <CardTitle>Activity</CardTitle>

            <CardDescription>
              {selectedYearNumber
                ? `Your completed work for ${selectedYearNumber}.`
                : 'Your recent completed work.'}
            </CardDescription>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className='w-[110px]'>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='all'>Recent</SelectItem>

                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Activity className='text-muted-foreground hidden size-5 sm:block' />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='overflow-x-auto pb-2'>
          <div className='min-w-[620px]'>
            {/* Month labels */}
            <div className='relative mb-1 h-5'>
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
              <div className='flex w-full gap-1 px-2'>
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className='grid min-w-0 flex-1 grid-rows-7 gap-1'
                  >
                    {week.map((day) => {
                      const level = getActivityLevel(day.completedTasks);

                      return (
                        <Tooltip key={day.date}>
                          <TooltipTrigger asChild>
                            <button
                              type='button'
                              aria-label={`${formatActivityDate(day.date)}: ${
                                day.completedTasks
                              } ${
                                day.completedTasks === 1 ? 'task' : 'tasks'
                              } completed`}
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
                                {formatActivityDate(day.date)}
                              </p>

                              <p className='text-xs'>
                                {day.completedTasks}{' '}
                                {day.completedTasks === 1 ? 'task' : 'tasks'}{' '}
                                completed
                              </p>

                              <p className='text-muted-foreground text-xs'>
                                {formatActivityFocusTime(day.focusedMinutes)}{' '}
                                focused
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
        </div>

        {/* Activity summary */}
        <div className='mt-6 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm'>
            {totalCompletedTasks} {totalCompletedTasks === 1 ? 'task' : 'tasks'}{' '}
            completed · {formatActivityFocusTime(totalFocusMinutes)} focused
          </p>

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
        </div>
      </CardContent>
    </Card>
  );
}
