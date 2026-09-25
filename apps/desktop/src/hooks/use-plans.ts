import { useCallback, useState } from 'react';

import {
  createPlan as createStoredPlan,
  deletePlan as deleteStoredPlan,
  getPlans,
} from '../lib/plans/plan-storage';
import { Plan } from '../lib/plans/types';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>(() => getPlans());

  const createPlan = useCallback(
    (data: Pick<Plan, 'title' | 'description'>) => {
      const plan = createStoredPlan(data);

      setPlans((currentPlans) => [...currentPlans, plan]);

      return plan;
    },
    [],
  );

  const deletePlan = useCallback((id: string) => {
    if (!plans.find((plan) => plan.id === id)) {
      throw new Error(`Plan with id "${id}" not found.`);
    }
    deleteStoredPlan(id);

    setPlans((currentPlans) => currentPlans.filter((plan) => plan.id !== id));
  }, []);

  return {
    plans,
    createPlan,
    deletePlan,
  };
}
