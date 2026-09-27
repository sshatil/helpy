import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';

import { CreateTaskDialog } from '../components/plan-details/create-task-dialog';
import { EditPlanDialog } from '../components/plan-details/edit-plan-dialog';
import { TaskList } from '../components/plan-details/task-list';
import { TaskExecutionCard } from '../components/plans/task-execution-card';

import { usePlans } from '../hooks/use-plans';
import { useTasks } from '../hooks/use-tasks';

import { executionStore } from '../lib/plans/execution-store';
import { useExecutionSnapshot } from '../hooks/use-task-execution';

export default function PlanDetailsPage() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const { plans, updatePlan, deletePlan } = usePlans();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const plan = plans.find((item) => item.id === planId);

  const { tasks, createTask, updateTask, deleteTask, reorderTasks } = useTasks(
    planId ?? '',
  );

  const { completedTaskId } = useExecutionSnapshot();

  useEffect(() => {
    return () => {
      executionStore.clearCompletedTask();
    };
  }, []);

  if (!plan || !planId) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Plan not found</h1>

          <p className='text-muted-foreground mt-2'>
            This plan does not exist or has been removed.
          </p>
        </div>

        <Button asChild>
          <Link to='/study/plans'>Back to Plans</Link>
        </Button>
      </div>
    );
  }

  const completedTasks = tasks.filter((task) => task.completed).length;

  const completedTask = completedTaskId
    ? tasks.find((task) => task.id === completedTaskId)
    : undefined;

  const activeTask =
    completedTask ??
    tasks.find(
      (task) => task.status === 'running' || task.status === 'paused',
    ) ??
    tasks.find((task) => task.status === 'ready');

  const progress =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  function handleUpdatePlan(
    id: string,
    data: {
      title?: string;
      description?: string;
    },
  ) {
    updatePlan({
      id,
      data,
    });
  }

  const selectedPlan = plan.id;
  function handleDeletePlan() {
    deletePlan(selectedPlan, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        navigate('/study/plans');
      },
    });
  }

  function handleMoveTask(taskIndex: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;

    if (newIndex < 0 || newIndex >= tasks.length) {
      return;
    }

    const taskIds = tasks.map((task) => task.id);

    [taskIds[taskIndex], taskIds[newIndex]] = [
      taskIds[newIndex],
      taskIds[taskIndex],
    ];

    reorderTasks(taskIds);
  }

  function handleManualComplete(task: (typeof tasks)[number]) {
    const nextCompleted = !task.completed;

    updateTask(task.id, {
      completed: nextCompleted,
      status: nextCompleted ? 'completed' : 'ready',
    });
  }

  function handleNextTask() {
    executionStore.clearCompletedTask();
  }

  function handleResetTask(taskId: string) {
    executionStore.resetTask(taskId);
  }

  return (
    <div className='space-y-8'>
      {/* Plan Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-3xl font-bold tracking-tight'>{plan.title}</h1>
          </div>

          {plan.description && (
            <p className='text-muted-foreground mt-2 max-w-3xl'>
              {plan.description}
            </p>
          )}

          <div className='text-muted-foreground mt-3 text-sm'>
            {completedTasks} of {tasks.length} tasks completed
          </div>
        </div>

        <div className='flex shrink-0 flex-wrap gap-2'>
          <EditPlanDialog plan={plan} onUpdate={handleUpdatePlan} />

          <Button
            variant='destructive'
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className='mr-2 size-4' />
            Delete Plan
          </Button>
        </div>
      </div>

      {/* Plan Details */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
          <CardDescription>
            Track your progress through this plan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='grid gap-4 sm:grid-cols-4'>
            <div>
              <p className='text-muted-foreground text-sm'>Total Tasks</p>
              <p className='mt-1 text-2xl font-bold'>{tasks.length}</p>
            </div>

            <div>
              <p className='text-muted-foreground text-sm'>Completed</p>
              <p className='mt-1 text-2xl font-bold'>{completedTasks}</p>
            </div>

            <div>
              <p className='text-muted-foreground text-sm'>Remaining</p>
              <p className='mt-1 text-2xl font-bold'>
                {tasks.length - completedTasks}
              </p>
            </div>

            <div>
              <p className='text-muted-foreground text-sm'>Progress</p>
              <p className='mt-1 text-2xl font-bold'>{progress}%</p>
            </div>
          </div>

          <div className='mt-6 space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Overall progress</span>

              <span className='font-medium'>
                {completedTasks} / {tasks.length}
              </span>
            </div>

            <div className='bg-muted h-2 overflow-hidden rounded-full'>
              <div
                className='bg-primary h-full rounded-full transition-all'
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Task */}
      {activeTask && (
        <TaskExecutionCard
          key={activeTask.id}
          task={activeTask}
          onNextTask={handleNextTask}
          onReset={() => handleResetTask(activeTask.id)}
        />
      )}

      {/* Tasks */}
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle>Tasks</CardTitle>

              <CardDescription>
                Complete each task in order. Start the next task manually when
                you are ready.
              </CardDescription>
            </div>

            <CreateTaskDialog
              onCreate={(data) =>
                createTask({
                  ...data,
                  planId: plan.id,
                })
              }
            />
          </div>
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <div className='text-muted-foreground rounded-lg border border-dashed p-8 text-center'>
              <p className='font-medium'>No tasks yet</p>

              <p className='mt-1 text-sm'>
                Add your first task to start working on this plan.
              </p>
            </div>
          ) : (
            <div className='space-y-6'>
              {tasks.map((task, index) => (
                <TaskList
                  key={task.id}
                  task={task}
                  index={index}
                  tasks={tasks}
                  updateTask={updateTask}
                  handleMoveTask={handleMoveTask}
                  deleteTask={deleteTask}
                  onToggleComplete={() => handleManualComplete(task)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Plan Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete plan?</DialogTitle>

            <DialogDescription>
              This will permanently delete "{plan.title}" and all of its tasks.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button variant='destructive' onClick={handleDeletePlan}>
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
