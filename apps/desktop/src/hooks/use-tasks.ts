import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTask,
  deleteTask,
  getTasks,
  reorderTasks,
  updateTask,
} from '../lib/plans/task-repository';

import type {
  CreateTaskInput,
  UpdateTaskInput,
} from '../lib/plans/task-repository';

import { queryKeys } from '../lib/query/query-keys';

export function useTasks(planId: string) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: queryKeys.tasks.all(planId),
    queryFn: () => getTasks(planId),
    enabled: Boolean(planId),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskInput) => createTask(data),

    onSuccess: (task) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(planId),
      });

      if (task) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.tasks.detail(task.id),
        });
      }
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTask(id, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(planId),
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),

    onSuccess: (_, taskId) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(planId),
      });

      void queryClient.removeQueries({
        queryKey: queryKeys.tasks.detail(taskId),
      });
    },
  });

  const reorderTasksMutation = useMutation({
    mutationFn: (taskIds: string[]) => reorderTasks(planId, taskIds),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(planId),
      });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],

    isLoading: tasksQuery.isLoading,

    isFetching: tasksQuery.isFetching,

    error: tasksQuery.error,

    refetch: tasksQuery.refetch,

    createTask: createTaskMutation.mutate,

    updateTask: (id: string, data: UpdateTaskInput) =>
      updateTaskMutation.mutate({
        id,
        data,
      }),

    deleteTask: deleteTaskMutation.mutate,

    reorderTasks: reorderTasksMutation.mutate,

    isCreating: createTaskMutation.isPending,

    isUpdating: updateTaskMutation.isPending,

    isDeleting: deleteTaskMutation.isPending,

    isReordering: reorderTasksMutation.isPending,
  };
}
