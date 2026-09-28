import { CheckCircle2, Clock3 } from 'lucide-react';

import { Badge } from '@repo/ui/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { useExecutionHistory } from '../../hooks/use-execution-history';
import {
  formatActivityDate,
  formatFocusTime,
} from '../../lib/dashboard/dashboard-stats';

type Activity = ReturnType<typeof useExecutionHistory>['history'][number];

interface DashboardRecentActivityProps {
  activities: Activity[];
}

export function DashboardRecentActivity({
  activities,
}: DashboardRecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>

        <CardDescription>Your latest completed tasks.</CardDescription>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className='rounded-lg border border-dashed p-8 text-center'>
            <Clock3 className='text-muted-foreground mx-auto size-8' />

            <p className='mt-3 font-medium'>No activity yet</p>

            <p className='text-muted-foreground mt-1 text-sm'>
              Completed tasks will appear here.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {activities.map((item, index) => (
              <div key={item.id}>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex min-w-0 items-start gap-3'>
                    <div className='bg-primary/10 mt-0.5 rounded-full p-2'>
                      <CheckCircle2 className='text-primary size-4' />
                    </div>

                    <div className='min-w-0'>
                      <p className='truncate font-medium'>{item.taskTitle}</p>

                      <p className='text-muted-foreground text-sm'>
                        {item.planTitle}
                      </p>

                      <p className='text-muted-foreground mt-1 text-xs'>
                        {formatActivityDate(item.completedAt)}
                      </p>
                    </div>
                  </div>

                  <Badge variant='outline'>
                    {formatFocusTime(item.actualDuration)}
                  </Badge>
                </div>

                {index < activities.length - 1 && (
                  <div className='mt-4 border-b' />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
