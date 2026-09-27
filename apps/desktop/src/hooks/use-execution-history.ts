import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  clearAllExecutionHistory,
  getAllExecutionHistory,
} from '../lib/history/history-repository';

import { queryKeys } from '../lib/query/query-keys';

export function useExecutionHistory() {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: queryKeys.history.all,

    queryFn: getAllExecutionHistory,
  });

  const clearHistoryMutation = useMutation({
    mutationFn: clearAllExecutionHistory,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.history.all,
      });
    },
  });

  return {
    history: historyQuery.data ?? [],

    isLoading: historyQuery.isLoading,

    isFetching: historyQuery.isFetching,

    error: historyQuery.error,

    refetch: historyQuery.refetch,

    clearHistory: clearHistoryMutation.mutate,

    isClearing: clearHistoryMutation.isPending,
  };
}
