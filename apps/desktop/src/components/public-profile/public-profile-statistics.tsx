import { CalendarDays, CheckCircle2, Clock3, ListChecks } from 'lucide-react';

type PublicProfileStatisticsProps = {
  completedTasks: number;
  totalFocusMinutes: number;
  activeDays: number;
  plansCreated: number;
};

function formatFocusTime(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function PublicProfileStatistics({
  completedTasks,
  totalFocusMinutes,
  activeDays,
  plansCreated,
}: PublicProfileStatisticsProps) {
  const statistics = [
    {
      label: 'Completed tasks',
      value: completedTasks.toLocaleString(),
      icon: CheckCircle2,
    },
    {
      label: 'Focus time',
      value: formatFocusTime(totalFocusMinutes),
      icon: Clock3,
    },
    {
      label: 'Active days',
      value: activeDays.toLocaleString(),
      icon: CalendarDays,
    },
    {
      label: 'Plans created',
      value: plansCreated.toLocaleString(),
      icon: ListChecks,
    },
  ];

  return (
    <div className='bg-card overflow-hidden rounded-xl border'>
      <div className='grid grid-cols-2 sm:grid-cols-4'>
        {statistics.map((statistic, index) => {
          const Icon = statistic.icon;

          return (
            <div
              key={statistic.label}
              className={[
                'flex items-center gap-3 px-5 py-5',
                index !== 0 ? 'border-l' : '',
                index >= 2 ? 'border-t sm:border-t-0' : '',
              ].join(' ')}
            >
              <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
                <Icon className='text-muted-foreground size-4' />
              </div>

              <div className='min-w-0'>
                <p className='truncate text-lg font-semibold tracking-tight'>
                  {statistic.value}
                </p>

                <p className='text-muted-foreground truncate text-xs'>
                  {statistic.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
