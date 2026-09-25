import { Button } from '@repo/ui/components/ui/button';

export default function DashboardPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold text-green-500'>Dashboard</h1>
      <p>Welcome to your dashboard.</p>
      <Button variant='link' className='text-2xl'>
        Click
      </Button>
    </div>
  );
}
