import { Link } from 'react-router-dom';

import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

export default function StudyPage() {
  return (
    <div className='space-y-8'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Study / Work</h1>

          <p className='mt-2 text-muted-foreground'>
            Create plans and organize your tasks.
          </p>
        </div>

        <Button asChild>
          <Link to='/study/plans/new'>Create Plan</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Plans</CardTitle>
        </CardHeader>

        <CardContent>
          <p className='text-sm text-muted-foreground'>
            You haven't created any plans yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
