import { Pause, Play, RotateCcw, Square } from 'lucide-react';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import type { Task, TaskStatus } from '../../lib/plans/types';
import { useTaskTimer } from '../../hooks/use-task-timer';

type TaskExecutionCardProps = {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
  onComplete: () => void;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;
}

export function TaskExecutionCard({
  task,
  onStatusChange,
  onComplete,
}: TaskExecutionCardProps) {
  const { status, remainingSeconds, start, pause, stop, reset } = useTaskTimer({
    duration: task.duration,
    initialStatus: task.status,
    onStatusChange,
    onComplete,
  });

  function handleStart() {
    start();
  }

  function handlePause() {
    pause();
  }

  function handleStop() {
    stop();
  }

  function handleReset() {
    reset();
  }

  const isRunning = status === 'running';

  const isPaused = status === 'paused';

  const isCompleted = status === 'completed';

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <CardTitle>Current Task</CardTitle>

            <CardDescription className='mt-1'>{task.title}</CardDescription>
          </div>

          <Badge
            variant={
              isRunning
                ? 'default'
                : isPaused
                  ? 'outline'
                  : isCompleted
                    ? 'secondary'
                    : 'secondary'
            }
          >
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='flex justify-center'>
          <div className='text-6xl font-bold tracking-tight tabular-nums'>
            {formatTime(remainingSeconds)}
          </div>
        </div>

        <div className='flex flex-wrap justify-center gap-2'>
          {status === 'ready' && (
            <Button onClick={handleStart}>
              <Play className='mr-2 size-4' />
              Start
            </Button>
          )}

          {isRunning && (
            <>
              <Button onClick={handlePause} variant='outline'>
                <Pause className='mr-2 size-4' />
                Pause
              </Button>

              <Button onClick={handleStop} variant='destructive'>
                <Square className='mr-2 size-4' />
                Stop
              </Button>
            </>
          )}

          {isPaused && (
            <>
              <Button onClick={handleStart}>
                <Play className='mr-2 size-4' />
                Resume
              </Button>

              <Button onClick={handleStop} variant='destructive'>
                <Square className='mr-2 size-4' />
                Stop
              </Button>
            </>
          )}

          {isCompleted && (
            <Button onClick={handleReset} variant='outline'>
              <RotateCcw className='mr-2 size-4' />
              Reset
            </Button>
          )}
        </div>

        {isPaused && (
          <p className='text-muted-foreground text-center text-sm'>
            Timer paused with {formatTime(remainingSeconds)} remaining.
          </p>
        )}

        {isCompleted && (
          <p className='text-muted-foreground text-center text-sm'>
            Task completed.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
