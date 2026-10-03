import { supabase } from '../supabase/supabase-client';

import { mapPublicProfileSearchResult } from './public-profile-search-mapper';

import type { PublicProfileSearchResult } from './types';

export async function searchPublicProfiles(
  searchQuery: string,
): Promise<PublicProfileSearchResult[]> {
  const normalizedQuery = searchQuery.trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  const { data, error } = await supabase.rpc('search_public_profiles', {
    search_query: normalizedQuery,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map(mapPublicProfileSearchResult);
}
