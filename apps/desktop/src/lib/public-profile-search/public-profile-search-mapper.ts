import type { PublicProfileSearchResult } from './types';

type PublicProfileSearchRow = {
  id?: unknown;
  username?: unknown;
  display_name?: unknown;
  avatar_url?: unknown;
  bio?: unknown;
};

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getOptionalString(value: unknown): string | undefined {
  const valueString = getString(value).trim();

  return valueString || undefined;
}

export function mapPublicProfileSearchResult(
  row: PublicProfileSearchRow,
): PublicProfileSearchResult {
  return {
    id: getString(row.id),
    username: getString(row.username).trim(),
    displayName: getString(row.display_name).trim() || 'Helpy User',
    avatarUrl: getOptionalString(row.avatar_url),
    bio: getOptionalString(row.bio),
  };
}
