import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPlan,
  deletePlan,
  getAllPlans,
  updatePlan,
} from '../lib/plans/plan-repository';

import type {
  CreatePlanInput,
  UpdatePlanInput,
} from '../lib/plans/plan-repository';
import { queryKeys } from '../lib/query/query-keys';

export function usePlans() {
  const queryClient = useQueryClient();

  const plansQuery = useQuery({
    queryKey: queryKeys.plans.all,
    queryFn: getAllPlans,
  });

  const createPlanMutation = useMutation({
    mutationFn: (data: CreatePlanInput) => createPlan(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.plans.all,
      });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanInput }) =>
      updatePlan(id, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.plans.all,
      });
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => deletePlan(id),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.plans.all,
      });

      void queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
  });

  return {
    plans: plansQuery.data ?? [],

    isLoading: plansQuery.isLoading,

    isFetching: plansQuery.isFetching,

    error: plansQuery.error,

    refetch: plansQuery.refetch,

    createPlan: createPlanMutation.mutate,

    updatePlan: updatePlanMutation.mutate,

    deletePlan: deletePlanMutation.mutate,

    isCreating: createPlanMutation.isPending,

    isUpdating: updatePlanMutation.isPending,

    isDeleting: deletePlanMutation.isPending,
  };
}
