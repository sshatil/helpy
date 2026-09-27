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

export default function PlanDetailsPage() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const { plans, updatePlan, deletePlan } = usePlans();

  const [justCompletedTaskId, setJustCompletedTaskId] = useState<string>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const plan = plans.find((item) => item.id === planId);

  const { tasks, createTask, updateTask, deleteTask, reorderTasks } = useTasks(
    planId ?? '',
  );

  /*
   * Clear the temporary completed-task UI
   * when leaving this page.
   *
   * The execution itself is not stopped here.
   * This allows a running/paused task to
   * continue while the user navigates elsewhere.
   */
  useEffect(() => {
    return () => {
      setJustCompletedTaskId(undefined);
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

  /*
   * Priority:
   *
   * 1. The task that just completed.
   * 2. Currently running task.
   * 3. Currently paused task.
   * 4. First ready task.
   *
   * This gives us:
   *
   * - Completion -> keep completed task visible.
   * - Next Task -> show the next ready task.
   * - Navigation/reload -> show running/paused task
   *   if one exists, otherwise the first ready task.
   */
  const completedTask = justCompletedTaskId
    ? tasks.find((task) => task.id === justCompletedTaskId)
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

    /*
     * If the user manually completes
     * the currently displayed task,
     * keep it visible in the execution card.
     */
    if (nextCompleted && task.id === activeTask?.id) {
      setJustCompletedTaskId(task.id);
    }
  }

  function handleNextTask() {
    setJustCompletedTaskId(undefined);

    executionStore.clearCompletedTask();
  }

  function handleResetTask(taskId: string) {
    executionStore.resetTask(taskId);

    setJustCompletedTaskId(undefined);
  }

  return (
    <div className='space-y-8'>
      {/* Plan Header */}

      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <Button variant='ghost' className='mb-3 px-0' asChild>
            <Link to='/study/plans'>← Back to Plans</Link>
          </Button>

          <h1 className='text-3xl font-bold tracking-tight'>{plan.title}</h1>

          {plan.description && (
            <p className='text-muted-foreground mt-2'>{plan.description}</p>
          )}
        </div>

        <div className='flex gap-2'>
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

      {/* Task Statistics */}

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Tasks
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>{tasks.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Completed
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>{completedTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Progress
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>{progress}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Execution */}

      {activeTask && (
        <TaskExecutionCard
          key={activeTask.id}
          task={activeTask}
          onNextTask={handleNextTask}
          onReset={() => handleResetTask(activeTask.id)}
        />
      )}

      {/* Plan Complete */}

      {!activeTask && tasks.length > 0 && completedTasks === tasks.length && (
        <Card>
          <CardContent className='flex flex-col items-center justify-center gap-3 py-10 text-center'>
            <div className='text-lg font-semibold'>Plan completed</div>

            <p className='text-muted-foreground text-sm'>
              You completed all tasks in this plan.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tasks */}

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <CardTitle>Tasks</CardTitle>

              <CardDescription>
                Work through your tasks in order.
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
            <div className='rounded-lg border border-dashed p-8 text-center'>
              <p className='text-muted-foreground text-sm'>No tasks yet.</p>

              <p className='text-muted-foreground mt-1 text-sm'>
                Add your first task to this plan.
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {tasks.map((task, index) => (
                <div key={task.id} className='rounded-lg border p-4'>
                  <TaskList
                    task={task}
                    index={index}
                    updateTask={updateTask}
                    handleMoveTask={handleMoveTask}
                    deleteTask={deleteTask}
                    tasks={tasks}
                    onToggleComplete={() => handleManualComplete(task)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Plan Dialog */}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this plan?</DialogTitle>

            <DialogDescription>
              This will permanently delete "{plan.title}" and its tasks.
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
