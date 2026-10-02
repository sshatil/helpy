import type {
  PublicProfile,
  PublicProfileActivity,
  PublicProfileData,
  PublicProfileStatistics,
} from './types';

type PublicProfileRpcResponse = {
  profile?: {
    id?: unknown;
    display_name?: unknown;
    username?: unknown;
    avatar_url?: unknown;
    bio?: unknown;
    created_at?: unknown;
  } | null;
  statistics?: {
    completed_tasks?: unknown;
    total_focus_minutes?: unknown;
    active_days?: unknown;
    plans_created?: unknown;
  } | null;
  activity?: unknown;
};

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getOptionalString(value: unknown): string | undefined {
  const stringValue = getString(value).trim();

  return stringValue || undefined;
}

function getNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function mapProfile(
  profile: NonNullable<PublicProfileRpcResponse['profile']>,
): PublicProfile {
  return {
    id: getString(profile.id),
    displayName: getString(profile.display_name).trim() || 'Helpy User',
    username: getString(profile.username).trim(),
    avatarUrl: getOptionalString(profile.avatar_url),
    bio: getOptionalString(profile.bio),
    createdAt: getString(profile.created_at),
  };
}

function mapStatistics(
  statistics:
    NonNullable<PublicProfileRpcResponse['statistics']> | null | undefined,
): PublicProfileStatistics {
  return {
    completedTasks: getNumber(statistics?.completed_tasks),
    totalFocusMinutes: getNumber(statistics?.total_focus_minutes),
    activeDays: getNumber(statistics?.active_days),
    plansCreated: getNumber(statistics?.plans_created),
  };
}

function mapActivity(activity: unknown): PublicProfileActivity[] {
  if (!Array.isArray(activity)) {
    return [];
  }

  return activity
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null,
    )
    .map((item) => ({
      date: getString(item.date),
      count: getNumber(item.count),
      minutes: getNumber(item.minutes),
    }))
    .filter((item) => Boolean(item.date));
}

export function mapPublicProfile(data: unknown): PublicProfileData {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid public profile response.');
  }

  const response = data as PublicProfileRpcResponse;

  if (!response.profile) {
    throw new Error('Public profile not found.');
  }

  return {
    profile: mapProfile(response.profile),
    statistics: mapStatistics(response.statistics),
    activity: mapActivity(response.activity),
  };
}
