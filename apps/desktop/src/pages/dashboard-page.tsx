import { useMemo } from 'react';

import { useExecutionHistory } from '../hooks/use-execution-history';
import { usePlans } from '../hooks/use-plans';
import { useTask } from '../hooks/use-task';
import { useExecutionSnapshot } from '../hooks/use-task-execution';

import {
  getCompletedPlans,
  getTodayCompletedTasks,
  getTodayFocusMinutes,
  getTodayHistory,
  getTodayWorkedPlans,
} from '../lib/dashboard/dashboard-stats';

import { DashboardContinueWorking } from '../components/dashboard/dashboard-continue-working';
import { DashboardOverallProductivity } from '../components/dashboard/dashboard-overall-productivity';
import { DashboardRecentActivity } from '../components/dashboard/dashboard-recent-activity';
import { DashboardStatistics } from '../components/dashboard/dashboard-statistics';
import { DashboardTodayProgress } from '../components/dashboard/dashboard-today-progress';
import { DashboardActivityCalendar } from '../components/dashboard/dashboard-activity-calendar';

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

export default function DashboardPage() {
  const { plans, isLoading: isPlansLoading } = usePlans();

  const { history, isLoading: isHistoryLoading } = useExecutionHistory();

  const { execution } = useExecutionSnapshot();

  const { task: activeTask, isLoading: isActiveTaskLoading } = useTask(
    execution?.taskId,
  );

  const todayHistory = useMemo(() => getTodayHistory(history), [history]);

  const todayCompletedTasks = useMemo(
    () => getTodayCompletedTasks(history),
    [history],
  );

  const todayFocusMinutes = useMemo(
    () => getTodayFocusMinutes(history),
    [history],
  );

  const todayWorkedPlans = useMemo(
    () => getTodayWorkedPlans(history),
    [history],
  );

  const totalFocusMinutes = useMemo(
    () => history.reduce((total, item) => total + item.actualDuration, 0),
    [history],
  );

  const completedPlans = useMemo(
    () => getCompletedPlans(plans, history),
    [plans, history],
  );

  const totalPlans = plans.length;

  const todayTaskCount = todayHistory.length;

  const todayProgress =
    todayTaskCount === 0
      ? 0
      : Math.min(
          100,
          Math.round((todayCompletedTasks / Math.max(todayTaskCount, 1)) * 100),
        );

  const recentActivity = history.slice(0, 6);

  const plansWorked = useMemo(
    () => new Set(history.map((item) => item.planId)).size,
    [history],
  );

  const isLoading = isPlansLoading || isHistoryLoading;

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{getGreeting()}</h1>

          <p className='text-muted-foreground'>
            Loading your productivity overview...
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='bg-muted h-28 animate-pulse rounded-xl'
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>{getGreeting()}</h1>

        <p className='text-muted-foreground mt-1'>
          Here&apos;s your productivity overview.
        </p>
      </div>

      <DashboardStatistics
        todayCompletedTasks={todayCompletedTasks}
        todayFocusMinutes={todayFocusMinutes}
        todayWorkedPlans={todayWorkedPlans}
        totalPlans={totalPlans}
        completedPlans={completedPlans}
      />

      <div className=''>
        <DashboardActivityCalendar history={history} />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <DashboardTodayProgress
          completedTasks={todayCompletedTasks}
          focusMinutes={todayFocusMinutes}
          progress={todayProgress}
        />

        <DashboardOverallProductivity
          totalTasks={history.length}
          totalFocusMinutes={totalFocusMinutes}
          plansWorked={plansWorked}
        />
      </div>

      <DashboardContinueWorking
        task={activeTask}
        isLoading={isActiveTaskLoading}
      />
      <DashboardRecentActivity activities={recentActivity} />
    </div>
  );
}
