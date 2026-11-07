import { Link } from 'react-router-dom';

import { Card, CardContent, CardTitle } from '@repo/ui/components/ui/card';
import { usePlans } from '../../hooks/use-plans';

export function Plan() {
  const { plans } = usePlans();
  return (
    <>
      {plans.map((plan) => (
        <Link to={`/study/plans/${plan.id}`}>
          <Card key={plan.id} className=''>
            <CardContent>
              <CardTitle className='text-lg'>{plan.title}</CardTitle>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
}
