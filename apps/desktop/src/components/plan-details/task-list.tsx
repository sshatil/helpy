import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { cn } from 'cn';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';

import type { Task } from '../../lib/plans/types';
import { EditTaskDialog } from './edit-task-dialog';

type TaskProps = {
  task: Task;
  tasks: Task[];
  index: number;
  updateTask: (id: string, data: any) => void;
  handleMoveTask: (taskId: string, direction: 'up' | 'down') => void;
  deleteTask: (id: string) => void;
  onToggleComplete: () => void;
};

export function TaskList({
  task,
  tasks,
  index,
  updateTask,
  handleMoveTask,
  deleteTask,
  onToggleComplete,
}: TaskProps) {
  const isFirstTask = index === 0;
  const isLastTask = index === tasks.length - 1;

  const previousTask = tasks[index - 1];
  const nextTask = tasks[index + 1];

  const canMoveUp = !isFirstTask && !task.completed;

  const canMoveDown =
    !isLastTask &&
    !task.completed &&
    nextTask !== undefined &&
    !nextTask.completed;

  return (
    <div className='flex items-start gap-4'>
      <div className='bg-muted flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-medium'>
        {index + 1}
      </div>

      <div
        className={cn(
          'min-w-0 flex-1 rounded-xl border p-4',
          task.completed && 'bg-muted',
        )}
      >
        <div className='flex flex-wrap items-center gap-2'>
          <h3
            className={
              task.completed
                ? 'text-muted-foreground font-medium line-through'
                : 'font-medium'
            }
          >
            {task.title}
          </h3>

          <Badge variant='secondary'>{task.duration} min</Badge>

          {task.completed && <Badge>Completed</Badge>}

          {task.status === 'running' && <Badge>Running</Badge>}

          {task.status === 'paused' && <Badge variant='outline'>Paused</Badge>}
        </div>

        {task.notes && (
          <p className='text-muted-foreground mt-2 text-sm'>{task.notes}</p>
        )}

        {task.links.length > 0 && (
          <div className='mt-3 space-y-1'>
            {task.links.map((link) => (
              <a
                key={link}
                href={link}
                target='_blank'
                rel='noreferrer'
                className='text-primary block truncate text-sm underline-offset-4 hover:underline'
              >
                {link}
              </a>
            ))}
          </div>
        )}

        <div className='mt-4 flex flex-wrap gap-2'>
          <Button
            size='sm'
            variant={task.completed ? 'outline' : 'secondary'}
            onClick={onToggleComplete}
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>

          <EditTaskDialog task={task} onUpdate={updateTask} />

          {!task.completed && (
            <>
              <Button
                size='sm'
                variant='ghost'
                disabled={!canMoveUp}
                onClick={() => handleMoveTask(task.id, 'up')}
              >
                <ArrowUp className='mr-1 size-4' />
                Up
              </Button>

              <Button
                size='sm'
                variant='ghost'
                disabled={!canMoveDown}
                onClick={() => handleMoveTask(task.id, 'down')}
              >
                <ArrowDown className='mr-1 size-4' />
                Down
              </Button>
            </>
          )}

          <Button
            size='sm'
            variant='ghost'
            className='text-destructive hover:text-destructive'
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className='mr-1 size-4' />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
