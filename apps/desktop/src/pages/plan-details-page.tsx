import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { getPlanById } from '../lib/plans/plan-storage';
import { usePlans } from '../hooks/use-plans';

export default function PlanDetailsPage() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const { deletePlan } = usePlans();

  const plan = planId ? getPlanById(planId) : undefined;

  if (!plan) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Plan not found</h1>

          <p className='text-muted-foreground mt-2'>
            This plan does not exist or has been removed.
          </p>
        </div>

        <Button onClick={() => navigate('/study/plans')}>Back to Plans</Button>
      </div>
    );
  }

  const currentPlanId = plan.id;
  function handleDelete() {
    deletePlan(currentPlanId);
    navigate('/study/plans');
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{plan.title}</h1>

          {plan.description && (
            <p className='text-muted-foreground mt-2'>{plan.description}</p>
          )}
        </div>

        <Button variant='destructive' onClick={handleDelete}>
          Delete Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>

          <CardDescription>
            Tasks for this plan will be added here.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className='text-muted-foreground text-sm'>No tasks yet.</p>
        </CardContent>
      </Card>

      <Button variant='outline' onClick={() => navigate('/study/plans')}>
        Back to Plans
      </Button>
    </div>
  );
}
