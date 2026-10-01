import { supabase } from '../supabase/supabase-client';
import { mapTask } from '../supabase/mappers';

import type { Task } from './types';
import { getCurrentUser } from '../auth/auth-repository';

export type CreateTaskInput = Omit<
  Task,
  'id' | 'createdAt' | 'updatedAt' | 'order' | 'completed' | 'status'
>;

export type UpdateTaskInput = Partial<
  Pick<Task, 'title' | 'duration' | 'notes' | 'links' | 'completed' | 'status'>
>;

export async function getTasks(planId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('plan_id', planId)
    .order('task_order', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data.map(mapTask);
}

export async function getTask(taskId: string): Promise<Task | undefined> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapTask(data) : undefined;
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be authenticated to create a task.');
  }
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      plan_id: data.planId,
      title: data.title,
      duration: data.duration,
      notes: data.notes ?? null,
      links: data.links,
      task_order: 0,
      completed: false,
      status: 'ready',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapTask(task);
}

export async function updateTask(
  id: string,
  data: UpdateTaskInput,
): Promise<Task | undefined> {
  const { data: task, error } = await supabase
    .from('tasks')
    .update({
      ...(data.title !== undefined
        ? {
            title: data.title,
          }
        : {}),
      ...(data.duration !== undefined
        ? {
            duration: data.duration,
          }
        : {}),
      ...(data.notes !== undefined
        ? {
            notes: data.notes ?? null,
          }
        : {}),
      ...(data.links !== undefined
        ? {
            links: data.links,
          }
        : {}),
      ...(data.completed !== undefined
        ? {
            completed: data.completed,
          }
        : {}),
      ...(data.status !== undefined
        ? {
            status: data.status,
          }
        : {}),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return task ? mapTask(task) : undefined;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    throw error;
  }
}

export async function reorderTasks(
  planId: string,
  taskIds: string[],
): Promise<Task[]> {
  for (const [index, taskId] of taskIds.entries()) {
    const { error } = await supabase
      .from('tasks')
      .update({
        task_order: index,
      })
      .eq('id', taskId)
      .eq('plan_id', planId);

    if (error) {
      throw error;
    }
  }

  return getTasks(planId);
}
