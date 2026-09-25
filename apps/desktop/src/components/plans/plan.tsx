import { Link } from 'react-router-dom';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { usePlans } from '../../hooks/use-plans';

export function Plan() {
  const { plans } = usePlans();
  return (
    <>
      {plans.map((plan) => (
        <Link to={`/study/plans/${plan.id}`}>
          <Card key={plan.id} className='min-h-24'>
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>

              {plan.description && (
                <CardDescription>{plan.description}</CardDescription>
              )}
            </CardHeader>

            {/* <CardContent>
                  
                </CardContent> */}
          </Card>
        </Link>
      ))}
    </>
  );
}
