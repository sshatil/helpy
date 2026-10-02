import type { Profile } from './types';

import type { ProfileRow } from '../supabase/types';

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name?.trim() || 'Helpy User',
    username: row.username?.trim() || '',
    avatarUrl: row.avatar_url ?? undefined,
    bio: row.bio?.trim() || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
