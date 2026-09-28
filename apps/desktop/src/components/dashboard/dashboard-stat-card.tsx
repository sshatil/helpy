import type { LucideIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>

        <Icon className='text-muted-foreground size-4' />
      </CardHeader>

      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>

        <p className='text-muted-foreground text-xs'>{description}</p>
      </CardContent>
    </Card>
  );
}
