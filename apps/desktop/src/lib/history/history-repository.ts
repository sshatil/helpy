import { supabase } from '../supabase/supabase-client';
import { mapHistory } from '../supabase/mappers';

import type { TaskExecutionHistory } from './types';
import { getCurrentUser } from '../auth/auth-repository';

export async function getAllExecutionHistory(): Promise<
  TaskExecutionHistory[]
> {
  const { data, error } = await supabase
    .from('task_execution_history')
    .select('*')
    .order('completed_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data.map(mapHistory);
}

export async function createExecutionHistory(
  data: TaskExecutionHistory,
): Promise<TaskExecutionHistory> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { data: history, error } = await supabase
    .from('task_execution_history')
    .insert({
      user_id: user.id,
      task_id: data.taskId,
      plan_id: data.planId,
      plan_title: data.planTitle,
      task_title: data.taskTitle,
      planned_duration: data.plannedDuration,
      started_at: data.startedAt,
      completed_at: data.completedAt,
      actual_duration: data.actualDuration,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapHistory(history);
}

export async function clearAllExecutionHistory(): Promise<void> {
  const { error } = await supabase
    .from('task_execution_history')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    throw error;
  }
}
