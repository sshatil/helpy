import { useMemo, useState } from 'react';
import { Clock, ListChecks, Trash2 } from 'lucide-react';

import { Badge } from '@repo/ui/components/ui/badge';
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
import { Separator } from '@repo/ui/components/ui/separator';

import { useExecutionHistory } from '../hooks/use-execution-history';

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getDateKey(date: string) {
  const value = new Date(date);

  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-');
}

function getDateLabel(date: string) {
  const value = new Date(date);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );

  const target = new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
  );

  if (target.getTime() === today.getTime()) {
    return 'Today';
  }

  if (target.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return formatDate(date);
}

export default function HistoryPage() {
  const { history, isLoading, clearHistory, isClearing } =
    useExecutionHistory();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const totalFocusMinutes = history.reduce(
    (total, item) => total + item.actualDuration,
    0,
  );

  const completedTasks = history.length;

  const workedPlanIds = new Set(history.map((item) => item.planId));

  const workedPlans = workedPlanIds.size;

  const groupedHistory = useMemo(() => {
    const groups = new Map<string, typeof history>();

    for (const item of history) {
      const key = getDateKey(item.completedAt);

      const existing = groups.get(key);

      if (existing) {
        existing.push(item);
      } else {
        groups.set(key, [item]);
      }
    }

    return Array.from(groups.entries());
  }, [history]);

  async function handleClearHistory() {
    try {
      await clearHistory();
      setClearDialogOpen(false);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>History</h1>

          <p className='text-muted-foreground mt-2'>
            Review your completed task sessions and focus time.
          </p>
        </div>

        {history.length > 0 && (
          <Button
            variant='outline'
            className='text-destructive hover:text-destructive'
            onClick={() => setClearDialogOpen(true)}
          >
            <Trash2 className='mr-2 size-4' />
            Clear History
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-3'>
            <CardDescription>Total Focus Time</CardDescription>

            <CardTitle className='flex items-center gap-2 text-2xl'>
              <Clock className='text-muted-foreground size-5' />
              {formatDuration(totalFocusMinutes)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardDescription>Tasks Completed</CardDescription>

            <CardTitle className='flex items-center gap-2 text-2xl'>
              <ListChecks className='text-muted-foreground size-5' />
              {completedTasks}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardDescription>Plans Worked On</CardDescription>

            <CardTitle className='text-2xl'>{workedPlans}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Tasks</CardTitle>

          <CardDescription>
            Your completed timer sessions, grouped by day.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className='text-muted-foreground py-10 text-center'>
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className='rounded-lg border border-dashed p-10 text-center'>
              <div className='bg-muted mx-auto flex size-10 items-center justify-center rounded-full'>
                <Clock className='text-muted-foreground size-5' />
              </div>

              <h3 className='mt-4 font-medium'>No completed tasks yet</h3>

              <p className='text-muted-foreground mt-1 text-sm'>
                Complete a task using the timer and your execution history will
                appear here.
              </p>
            </div>
          ) : (
            <div className='space-y-8'>
              {groupedHistory.map(([dateKey, items]) => (
                <section key={dateKey} className='space-y-4'>
                  <div>
                    <h3 className='font-semibold'>
                      {getDateLabel(items[0].completedAt)}
                    </h3>

                    <p className='text-muted-foreground text-sm'>
                      {items.length} {items.length === 1 ? 'task' : 'tasks'}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    {items.map((item) => {
                      const planName = item.planTitle;

                      return (
                        <div key={item.id}>
                          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                            <div className='min-w-0'>
                              <div className='flex flex-wrap items-center gap-2'>
                                <h4 className='font-medium'>
                                  {item.taskTitle}
                                </h4>

                                <Badge variant='secondary'>
                                  {formatDuration(item.actualDuration)}
                                </Badge>
                              </div>

                              <p className='text-muted-foreground mt-1 text-sm'>
                                {planName}
                              </p>

                              <p className='text-muted-foreground mt-2 text-xs'>
                                Planned {item.plannedDuration} min
                                {' · '}
                                Completed {formatTime(item.completedAt)}
                              </p>
                            </div>

                            <div className='text-muted-foreground shrink-0 text-sm'>
                              {formatDuration(item.actualDuration)}
                            </div>
                          </div>

                          {item.id !== items[items.length - 1].id && (
                            <Separator className='mt-4' />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clear History Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear history?</DialogTitle>

            <DialogDescription>
              This will permanently delete all completed task execution history.
              Your plans and tasks will not be affected.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant='outline'
              disabled={isClearing}
              onClick={() => setClearDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant='destructive'
              disabled={isClearing}
              onClick={handleClearHistory}
            >
              {isClearing ? 'Clearing...' : 'Clear History'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
