import { supabase } from '../supabase/supabase-client';

import { mapPublicProfile } from './public-profile-mapper';

import type { PublicProfileData } from './types';

export async function getPublicProfile(
  username: string,
): Promise<PublicProfileData> {
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername) {
    throw new Error('Username is required.');
  }

  const { data, error } = await supabase.rpc('get_public_profile', {
    profile_username: normalizedUsername,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Public profile not found.');
  }

  return mapPublicProfile(data);
}
