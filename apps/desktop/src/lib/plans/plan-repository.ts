import {
  createPlan as createStoredPlan,
  deletePlan as deleteStoredPlan,
  getPlans,
  updatePlan as updateStoredPlan,
} from './plan-storage';

import type { Plan } from './types';

export type CreatePlanInput = Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePlanInput = Partial<Pick<Plan, 'title' | 'description'>>;

export async function getAllPlans(): Promise<Plan[]> {
  return getPlans();
}

export async function createPlan(data: CreatePlanInput): Promise<Plan> {
  return createStoredPlan(data);
}

export async function updatePlan(
  id: string,
  data: UpdatePlanInput,
): Promise<Plan | undefined> {
  return updateStoredPlan(id, data);
}

export async function deletePlan(id: string): Promise<void> {
  deleteStoredPlan(id);
}
