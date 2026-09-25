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

export function deletePlan(id: string): void {
  const plans = getPlans();

  const updatedPlans = plans.filter((plan) => plan.id !== id);

  localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
}
