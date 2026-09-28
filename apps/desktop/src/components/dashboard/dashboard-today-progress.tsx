import { CheckCircle2 } from 'lucide-react';

import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Progress } from '@repo/ui/components/ui/progress';

import { formatFocusTime } from '../../lib/dashboard/dashboard-stats';

interface DashboardTodayProgressProps {
  completedTasks: number;
  focusMinutes: number;
  progress: number;
}

export function DashboardTodayProgress({
  completedTasks,
  focusMinutes,
  progress,
}: DashboardTodayProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Progress</CardTitle>

        <CardDescription>Your completed focus sessions today.</CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        {completedTasks === 0 ? (
          <div className='rounded-lg border border-dashed p-6 text-center'>
            <CheckCircle2 className='text-muted-foreground mx-auto size-8' />

            <p className='mt-3 font-medium'>No completed tasks yet</p>

            <p className='text-muted-foreground mt-1 text-sm'>
              Start a task to begin building today&apos;s progress.
            </p>

            <Button asChild className='mt-4'>
              <a href='/study/plans'>View Plans</a>
            </Button>
          </div>
        ) : (
          <>
            <div className='flex items-end justify-between'>
              <div>
                <p className='text-2xl font-bold'>{completedTasks}</p>

                <p className='text-muted-foreground text-sm'>completed today</p>
              </div>

              <p className='text-sm font-medium'>
                {formatFocusTime(focusMinutes)}
              </p>
            </div>

            <Progress value={progress} />

            <p className='text-muted-foreground text-xs'>
              {completedTasks} completed focus{' '}
              {completedTasks === 1 ? 'session' : 'sessions'} today.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
