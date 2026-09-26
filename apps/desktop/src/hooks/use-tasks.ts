import { useCallback, useState } from 'react';

import {
  createTask as createStoredTask,
  deleteTask as deleteStoredTask,
  getTasksByPlanId,
  reorderTasks as reorderStoredTasks,
  updateTask as updateStoredTask,
} from '../lib/plans/task-storage';
import { Task } from '../lib/plans/types';

export function useTasks(planId: string) {
  const [tasks, setTasks] = useState<Task[]>(() => getTasksByPlanId(planId));

  const createTask = useCallback(
    (
      data: Omit<
        Task,
        'id' | 'createdAt' | 'updatedAt' | 'order' | 'completed'
      >,
    ) => {
      const task = createStoredTask(data);

      setTasks((currentTasks) => [...currentTasks, task]);

      return task;
    },
    [],
  );

  const updateTask = useCallback(
    (
      id: string,
      data: Partial<
        Pick<Task, 'title' | 'duration' | 'notes' | 'links' | 'completed'>
      >,
    ) => {
      const updatedTask = updateStoredTask(id, data);

      if (!updatedTask) {
        return undefined;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );

      return updatedTask;
    },
    [],
  );

  const deleteTask = useCallback((id: string) => {
    deleteStoredTask(id);

    setTasks((currentTasks) =>
      currentTasks
        .filter((task) => task.id !== id)
        .map((task, index) => ({
          ...task,
          order: index,
        })),
    );
  }, []);

  const reorderTasks = useCallback(
    (taskIds: string[]) => {
      const reorderedTasks = reorderStoredTasks(planId, taskIds);

      setTasks(reorderedTasks);
    },
    [planId],
  );

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
  };
}
