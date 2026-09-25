import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

export default function DashboardPage() {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>

        <p className='mt-2 text-muted-foreground'>
          Organize your plans, focus on your tasks, and track your progress.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Today's Plans
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Completed Tasks
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Focused Time
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>0m</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Current Streak
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>0 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Plans</CardTitle>
        </CardHeader>

        <CardContent>
          <p className='text-sm text-muted-foreground'>
            You don't have any plans yet.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>

        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Your productivity activity will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
