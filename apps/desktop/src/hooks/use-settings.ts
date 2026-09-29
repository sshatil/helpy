import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getAppSettings,
  resetAppSettings,
  saveAppSettings,
} from '../lib/settings/settings-repository';

import type { AppSettings } from '../lib/settings/types';

import { queryKeys } from '../lib/query/query-keys';

export function useSettings() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: queryKeys.settings.all,

    queryFn: getAppSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: AppSettings) => saveAppSettings(settings),

    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings.all, settings);
    },
  });

  const resetSettingsMutation = useMutation({
    mutationFn: resetAppSettings,

    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings.all, settings);
    },
  });

  return {
    settings: settingsQuery.data,

    isLoading: settingsQuery.isLoading,

    isFetching: settingsQuery.isFetching,

    error: settingsQuery.error,

    updateSettings: updateSettingsMutation.mutate,

    updateSettingsAsync: updateSettingsMutation.mutateAsync,

    resetSettings: resetSettingsMutation.mutate,

    resetSettingsAsync: resetSettingsMutation.mutateAsync,

    isUpdating: updateSettingsMutation.isPending,

    isResetting: resetSettingsMutation.isPending,
  };
}
