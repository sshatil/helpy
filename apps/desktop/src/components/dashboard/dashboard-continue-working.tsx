import { ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import type { useTask } from '../../hooks/use-task';

type Task = NonNullable<ReturnType<typeof useTask>['task']>;

interface DashboardContinueWorkingProps {
  task?: Task;
  isLoading: boolean;
}

export function DashboardContinueWorking({
  task,
  isLoading,
}: DashboardContinueWorkingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Working</CardTitle>

        <CardDescription>Pick up where you left off.</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className='bg-muted h-24 animate-pulse rounded-lg' />
        ) : task ? (
          <div className='flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2'>
                <h3 className='truncate font-semibold'>{task.title}</h3>

                <Badge variant='secondary'>{task.status}</Badge>
              </div>

              <p className='text-muted-foreground mt-1 text-sm'>
                {task.duration} min task
              </p>
            </div>

            <Button asChild>
              <Link to={`/study/plans/${task.planId}`}>
                Open Plan
                <ArrowRight className='ml-2 size-4' />
              </Link>
            </Button>
          </div>
        ) : (
          <div className='rounded-lg border border-dashed p-6 text-center'>
            <Target className='text-muted-foreground mx-auto size-8' />

            <p className='mt-3 font-medium'>Nothing in progress</p>

            <p className='text-muted-foreground mt-1 text-sm'>
              Choose a plan and start your next task.
            </p>

            <Button asChild className='mt-4'>
              <Link to='/study/plans'>View Plans</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
