import { CheckCircle2, Clock3, ListChecks, Target } from 'lucide-react';

import { DashboardStatCard } from './dashboard-stat-card';

import { formatFocusTime } from '../../lib/dashboard/dashboard-stats';

interface DashboardStatisticsProps {
  todayCompletedTasks: number;
  todayFocusMinutes: number;
  todayWorkedPlans: number;
  totalPlans: number;
  completedPlans: number;
}

export function DashboardStatistics({
  todayCompletedTasks,
  todayFocusMinutes,
  todayWorkedPlans,
  totalPlans,
  completedPlans,
}: DashboardStatisticsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      <DashboardStatCard
        title='Tasks Completed'
        value={todayCompletedTasks}
        description='Completed today'
        icon={CheckCircle2}
      />

      <DashboardStatCard
        title='Focus Time'
        value={formatFocusTime(todayFocusMinutes)}
        description='Focused today'
        icon={Clock3}
      />

      <DashboardStatCard
        title='Plans Worked'
        value={todayWorkedPlans}
        description='Plans worked on today'
        icon={Target}
      />

      <DashboardStatCard
        title='Total Plans'
        value={totalPlans}
        description={`${completedPlans} with recorded activity`}
        icon={ListChecks}
      />
    </div>
  );
}
