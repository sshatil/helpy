import { CheckCircle2, Pause, Play, RotateCcw, Square } from 'lucide-react';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import type { Task } from '../../lib/plans/types';
import { useTaskExecution } from '../../hooks/use-task-execution';

type TaskExecutionCardProps = {
  task: Task;
  onComplete?: () => void;
  onNextTask?: () => void;
  onReset?: () => void;
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
  onComplete,
  onNextTask,
  onReset,
}: TaskExecutionCardProps) {
  const {
    status,
    remainingSeconds,
    isJustCompleted,
    start,
    pause,
    resume,
    stop,
    reset,
  } = useTaskExecution(task);

  const isCompleted =
    task.completed || isJustCompleted || status === 'completed';

  const isRunning = status === 'running';

  const isPaused = status === 'paused';

  const displaySeconds = isCompleted ? 0 : remainingSeconds;

  /*
   * The execution store owns the actual completion.
   *
   * onComplete is only notified when the task
   * transitions into the completed state.
   */
  function handleComplete() {
    onComplete?.();
  }

  function handleReset() {
    /*
     * Prefer the page-level reset handler because
     * the page also needs to refresh its task list.
     */
    if (onReset) {
      onReset();
      return;
    }

    reset();
  }

  function handleNextTask() {
    onNextTask?.();
  }

  /*
   * The timer store changes status to completed
   * when the timer reaches zero.
   *
   * The parent callback is therefore triggered
   * from the completion state.
   */
  if (isJustCompleted) {
    /*
     * The callback itself is handled by the
     * parent when the execution state changes.
     *
     * No side effect is needed here.
     */
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-4'>
          <div className='min-w-0'>
            <CardTitle>Current Task</CardTitle>

            <CardDescription className='mt-1 truncate'>
              {task.title}
            </CardDescription>
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
            {isCompleted ? 'Completed' : status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='flex justify-center'>
          <div className='text-6xl font-bold tracking-tight tabular-nums'>
            {formatTime(displaySeconds)}
          </div>
        </div>

        {isCompleted ? (
          <div className='space-y-4'>
            <div className='text-muted-foreground flex items-center justify-center gap-2 text-sm'>
              <CheckCircle2 className='size-4' />

              <span>Task completed</span>
            </div>

            <div className='flex flex-wrap justify-center gap-2'>
              <Button variant='outline' onClick={handleReset}>
                <RotateCcw className='mr-2 size-4' />
                Reset
              </Button>

              {onNextTask && (
                <Button onClick={handleNextTask}>Next Task</Button>
              )}
            </div>
          </div>
        ) : (
          <div className='flex flex-wrap justify-center gap-2'>
            {status === 'ready' && (
              <Button onClick={start}>
                <Play className='mr-2 size-4' />
                Start
              </Button>
            )}

            {isRunning && (
              <>
                <Button variant='outline' onClick={pause}>
                  <Pause className='mr-2 size-4' />
                  Pause
                </Button>

                <Button variant='destructive' onClick={stop}>
                  <Square className='mr-2 size-4' />
                  Stop
                </Button>
              </>
            )}

            {isPaused && (
              <>
                <Button onClick={resume}>
                  <Play className='mr-2 size-4' />
                  Resume
                </Button>

                <Button variant='destructive' onClick={stop}>
                  <Square className='mr-2 size-4' />
                  Stop
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
