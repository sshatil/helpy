import {
  createTask as createStoredTask,
  deleteTask as deleteStoredTask,
  getTaskById,
  getTasksByPlanId,
  reorderTasks as reorderStoredTasks,
  updateTask as updateStoredTask,
} from './task-storage';

import type { Task } from './types';

export type CreateTaskInput = Omit<
  Task,
  'id' | 'createdAt' | 'updatedAt' | 'order' | 'completed' | 'status'
>;

export type UpdateTaskInput = Partial<
  Pick<Task, 'title' | 'duration' | 'notes' | 'links' | 'completed' | 'status'>
>;

export function getTasks(planId: string): Promise<Task[]> {
  return Promise.resolve(getTasksByPlanId(planId));
}

export function getTask(taskId: string): Promise<Task | undefined> {
  return Promise.resolve(getTaskById(taskId));
}

export function createTask(data: CreateTaskInput): Promise<Task> {
  return Promise.resolve(createStoredTask(data));
}

export function updateTask(
  id: string,
  data: UpdateTaskInput,
): Promise<Task | undefined> {
  return Promise.resolve(updateStoredTask(id, data));
}

export function deleteTask(id: string): Promise<void> {
  deleteStoredTask(id);

  return Promise.resolve();
}

export function reorderTasks(
  planId: string,
  taskIds: string[],
): Promise<Task[]> {
  return Promise.resolve(reorderStoredTasks(planId, taskIds));
}
