import { useQuery } from '@tanstack/react-query';

import { searchPublicProfiles } from '../lib/public-profile-search/public-profile-search-repository';

export const publicProfileSearchQueryKey = (searchQuery: string) =>
  ['public-profile-search', searchQuery.trim().toLowerCase()] as const;

export function usePublicProfileSearch(searchQuery: string) {
  const normalizedQuery = searchQuery.trim();

  return useQuery({
    queryKey: publicProfileSearchQueryKey(normalizedQuery),
    queryFn: () => searchPublicProfiles(normalizedQuery),
    enabled: normalizedQuery.length >= 2,
    staleTime: 30_000,
  });
}
