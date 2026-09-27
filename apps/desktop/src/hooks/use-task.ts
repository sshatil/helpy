import { useQuery } from '@tanstack/react-query';

import { getTask } from '../lib/plans/task-repository';
import { queryKeys } from '../lib/query/query-keys';

export function useTask(taskId?: string) {
  const taskQuery = useQuery({
    queryKey: taskId
      ? queryKeys.tasks.detail(taskId)
      : ['tasks', 'detail', 'none'],
    queryFn: () => getTask(taskId!),
    enabled: Boolean(taskId),
  });

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isLoading,
    isFetching: taskQuery.isFetching,
    error: taskQuery.error,
  };
}
