import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Task } from '../../lib/plans/types';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

type TaskProps = {
  task: Task;
  tasks: Task[];
  index: number;
  updateTask: (id: string, data: any) => void;
  handleMoveTask: (index: number, direction: 'up' | 'down') => void;
  deleteTask: (id: string) => void;
};

export function TaskList({
  task,
  index,
  updateTask,
  handleMoveTask,
  deleteTask,
  tasks,
}: TaskProps) {
  return (
    <div className='flex items-start gap-4'>
      <div className='bg-muted flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-medium'>
        {index + 1}
      </div>

      <div className='min-w-0 flex-1'>
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
            onClick={() =>
              updateTask(task.id, {
                completed: !task.completed,
              })
            }
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>

          {/* <EditTaskDialog task={task} onUpdate={updateTask} /> */}

          <Button
            size='sm'
            variant='ghost'
            disabled={index === 0}
            onClick={() => handleMoveTask(index, 'up')}
          >
            <ArrowUp className='mr-1 size-4' />
            Up
          </Button>

          <Button
            size='sm'
            variant='ghost'
            disabled={index === tasks.length - 1}
            onClick={() => handleMoveTask(index, 'down')}
          >
            <ArrowDown className='mr-1 size-4' />
            Down
          </Button>

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
