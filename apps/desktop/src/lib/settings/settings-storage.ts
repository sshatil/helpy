import { AppSettings, DEFAULT_APP_SETTINGS } from './types';

const SETTINGS_STORAGE_KEY = 'productivity-settings';

export function getSettings(): AppSettings {
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!stored) {
    return DEFAULT_APP_SETTINGS;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<AppSettings>;

    return {
      ...DEFAULT_APP_SETTINGS,
      ...parsed,

      notifications: {
        ...DEFAULT_APP_SETTINGS.notifications,
        ...parsed.notifications,
      },

      appearance: {
        ...DEFAULT_APP_SETTINGS.appearance,
        ...parsed.appearance,
      },
    };
  } catch {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);

    return DEFAULT_APP_SETTINGS;
  }
}

export function updateSettings(settings: AppSettings): AppSettings {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));

  return settings;
}

export function resetSettings(): AppSettings {
  localStorage.removeItem(SETTINGS_STORAGE_KEY);

  return DEFAULT_APP_SETTINGS;
}
