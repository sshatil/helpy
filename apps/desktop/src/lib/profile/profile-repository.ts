import { getCurrentUser } from '../auth/auth-repository';

import { supabase } from '../supabase/supabase-client';

import { mapProfile } from './profile-mapper';

import type { Profile, UpdateProfileInput } from './types';

export async function getProfile(): Promise<Profile> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('You must be authenticated to load your profile.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return mapProfile(data);
}

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<Profile> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('You must be authenticated to update your profile.');
  }

  const displayName = input.displayName.trim();

  const username = input.username.trim().toLowerCase();

  const bio = input.bio.trim();

  if (!displayName) {
    throw new Error('Display name is required.');
  }

  if (username.length < 3 || username.length > 30) {
    throw new Error('Username must be between 3 and 30 characters.');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error(
      'Username can only contain letters, numbers, and underscores.',
    );
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      username,
      bio: bio || null,
    })
    .eq('id', user.id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapProfile(data);
}
