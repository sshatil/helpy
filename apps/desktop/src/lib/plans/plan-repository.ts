import { getCurrentUser } from '../auth/auth-repository';
import { mapPlan } from '../supabase/mappers';
import { supabase } from '../supabase/supabase-client';

import type { Plan } from './types';

export type CreatePlanInput = Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePlanInput = Partial<Pick<Plan, 'title' | 'description'>>;

export async function getAllPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data.map(mapPlan);
}

export async function getPlanById(id: string): Promise<Plan | undefined> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPlan(data) : undefined;
}

export async function createPlan(data: CreatePlanInput): Promise<Plan> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be authenticated to create a plan.');
  }
  const { data: plan, error } = await supabase
    .from('plans')
    .insert({
      user_id: user.id,
      title: data.title,
      description: data.description ?? null,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return mapPlan(plan);
}

export async function updatePlan(
  id: string,
  data: UpdatePlanInput,
): Promise<Plan | undefined> {
  const { data: plan, error } = await supabase
    .from('plans')
    .update({
      ...(data.title !== undefined
        ? {
            title: data.title,
          }
        : {}),
      ...(data.description !== undefined
        ? {
            description: data.description ?? null,
          }
        : {}),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return plan ? mapPlan(plan) : undefined;
}

export async function deletePlan(id: string): Promise<void> {
  const { error } = await supabase.from('plans').delete().eq('id', id);

  if (error) {
    throw error;
  }
}
