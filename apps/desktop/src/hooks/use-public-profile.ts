import { useQuery } from '@tanstack/react-query';

import { getPublicProfile } from '../lib/public-profile/public-profile-repository';

export const publicProfileQueryKey = (username: string) =>
  ['public-profile', username.toLowerCase()] as const;

export function usePublicProfile(username?: string) {
  const normalizedUsername = username?.trim().toLowerCase() ?? '';

  return useQuery({
    queryKey: publicProfileQueryKey(normalizedUsername),
    queryFn: () => getPublicProfile(normalizedUsername),
    enabled: Boolean(normalizedUsername),
  });
}
