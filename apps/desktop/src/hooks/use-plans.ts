import { useCallback, useState } from 'react';

import {
  createPlan as createStoredPlan,
  deletePlan as deleteStoredPlan,
  getPlans,
  updatePlan as updateStoredPlan,
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

  const updatePlan = useCallback(
    (id: string, data: Partial<Pick<Plan, 'title' | 'description'>>) => {
      const updatedPlan = updateStoredPlan(id, data);

      if (!updatedPlan) {
        return undefined;
      }

      setPlans((currentPlans) =>
        currentPlans.map((plan) => (plan.id === id ? updatedPlan : plan)),
      );

      return updatedPlan;
    },
    [],
  );

  const deletePlan = useCallback((id: string) => {
    deleteStoredPlan(id);

    setPlans((currentPlans) => currentPlans.filter((plan) => plan.id !== id));
  }, []);

  return {
    plans,
    createPlan,
    updatePlan,
    deletePlan,
  };
}
