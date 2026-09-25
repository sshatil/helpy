import { CreatePlanDialog } from '../components/plans/create-plan-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { usePlans } from '../hooks/use-plans';
import { Plan } from '../components/plans/plan';

export default function PlansPage() {
  const { plans, createPlan } = usePlans();

  return (
    <div className='space-y-8'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Study / Work</h1>

          <p className='text-muted-foreground mt-2'>
            Create plans, organize your tasks, and work through them step by
            step.
          </p>
        </div>

        <CreatePlanDialog onCreate={createPlan} />
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No plans yet</CardTitle>

            <CardDescription>
              Create your first plan to get started.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <CreatePlanDialog onCreate={createPlan} />
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          <Plan />
        </div>
      )}
    </div>
  );
}
