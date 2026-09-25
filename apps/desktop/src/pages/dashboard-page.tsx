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

        <p className='text-muted-foreground mt-2'>
          Organize your plans, focus on your tasks, and track your progress.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Today's Plans
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Completed Tasks
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Focused Time
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-3xl font-bold'>0m</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
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
          <p className='text-muted-foreground text-sm'>
            You don't have any plans yet.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>

        <CardContent>
          <p className='text-muted-foreground text-sm'>
            Your productivity activity will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
