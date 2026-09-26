import { deleteTasksByPlanId } from './task-storage';
import { Plan } from './types';

const PLANS_STORAGE_KEY = 'productivity-plans';

export function getPlans(): Plan[] {
  try {
    const storedPlans = localStorage.getItem(PLANS_STORAGE_KEY);

    if (!storedPlans) {
      return [];
    }

    const parsedPlans = JSON.parse(storedPlans);

    if (!Array.isArray(parsedPlans)) {
      return [];
    }

    return parsedPlans;
  } catch {
    return [];
  }
}

export function getPlanById(id: string): Plan | undefined {
  return getPlans().find((plan) => plan.id === id);
}

export function createPlan(data: Pick<Plan, 'title' | 'description'>): Plan {
  const now = new Date().toISOString();

  const plan: Plan = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    createdAt: now,
    updatedAt: now,
  };

  const plans = getPlans();

  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify([...plans, plan]));

  return plan;
}

export function updatePlan(
  id: string,
  data: Partial<Pick<Plan, 'title' | 'description'>>,
): Plan | undefined {
  const plans = getPlans();

  const planIndex = plans.findIndex((plan) => plan.id === id);

  if (planIndex === -1) {
    return undefined;
  }

  const updatedPlan: Plan = {
    ...plans[planIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const updatedPlans = [...plans];

  updatedPlans[planIndex] = updatedPlan;

  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));

  return updatedPlan;
}

export function deletePlan(id: string): void {
  const plans = getPlans();

  const updatedPlans = plans.filter((plan) => plan.id !== id);

  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));

  deleteTasksByPlanId(id);
}
