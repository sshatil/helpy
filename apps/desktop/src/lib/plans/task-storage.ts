import type { Task } from './types';

const TASKS_STORAGE_KEY = 'productivity-tasks';

function getAllTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

    if (!storedTasks) {
      return [];
    }

    const parsedTasks = JSON.parse(storedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks;
  } catch {
    return [];
  }
}

function saveAllTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

export function getTasksByPlanId(planId: string): Task[] {
  return getAllTasks()
    .filter((task) => task.planId === planId)
    .sort((a, b) => a.order - b.order);
}

export function getTaskById(id: string): Task | undefined {
  return getAllTasks().find((task) => task.id === id);
}

export function createTask(
  data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'completed'>,
): Task {
  const now = new Date().toISOString();
  const tasks = getAllTasks();

  const planTasks = tasks.filter((task) => task.planId === data.planId);

  const nextOrder = planTasks.length;

  const task: Task = {
    ...data,
    id: crypto.randomUUID(),
    order: nextOrder,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  saveAllTasks([...tasks, task]);

  return task;
}

export function updateTask(
  id: string,
  data: Partial<
    Pick<Task, 'title' | 'duration' | 'notes' | 'links' | 'completed'>
  >,
): Task | undefined {
  const tasks = getAllTasks();

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return undefined;
  }

  const updatedTask: Task = {
    ...tasks[taskIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const updatedTasks = [...tasks];

  updatedTasks[taskIndex] = updatedTask;

  saveAllTasks(updatedTasks);

  return updatedTask;
}

export function deleteTask(id: string): void {
  const tasks = getAllTasks();

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return;
  }

  const remainingTasks = tasks.filter((item) => item.id !== id);

  const reorderedTasks = remainingTasks
    .filter((item) => item.planId === task.planId)
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      ...item,
      order: index,
    }));

  const otherTasks = remainingTasks.filter(
    (item) => item.planId !== task.planId,
  );

  saveAllTasks([...otherTasks, ...reorderedTasks]);
}

export function reorderTasks(planId: string, taskIds: string[]): Task[] {
  const tasks = getAllTasks();

  const taskMap = new Map(
    tasks
      .filter((task) => task.planId === planId)
      .map((task) => [task.id, task]),
  );

  const reorderedPlanTasks = taskIds
    .map((id, index) => {
      const task = taskMap.get(id);

      if (!task) {
        return undefined;
      }

      return {
        ...task,
        order: index,
        updatedAt: new Date().toISOString(),
      };
    })
    .filter((task): task is Task => Boolean(task));

  const otherTasks = tasks.filter((task) => task.planId !== planId);

  saveAllTasks([...otherTasks, ...reorderedPlanTasks]);

  return reorderedPlanTasks;
}

export function deleteTasksByPlanId(planId: string): void {
  const tasks = getAllTasks();

  saveAllTasks(tasks.filter((task) => task.planId !== planId));
}
