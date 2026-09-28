import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { formatFocusTime } from '../../lib/dashboard/dashboard-stats';

interface DashboardOverallProductivityProps {
  totalTasks: number;
  totalFocusMinutes: number;
  plansWorked: number;
}

export function DashboardOverallProductivity({
  totalTasks,
  totalFocusMinutes,
  plansWorked,
}: DashboardOverallProductivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Productivity</CardTitle>

        <CardDescription>Your recorded productivity so far.</CardDescription>
      </CardHeader>

      <CardContent className='space-y-5'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-sm'>Completed tasks</span>

          <span className='font-semibold'>{totalTasks}</span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-sm'>Focus time</span>

          <span className='font-semibold'>
            {formatFocusTime(totalFocusMinutes)}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-sm'>Plans worked on</span>

          <span className='font-semibold'>{plansWorked}</span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-sm'>
            Recorded sessions
          </span>

          <span className='font-semibold'>{totalTasks}</span>
        </div>
      </CardContent>
    </Card>
  );
}
