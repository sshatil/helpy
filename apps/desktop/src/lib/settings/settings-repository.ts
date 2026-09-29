import { getSettings, resetSettings, updateSettings } from './settings-storage';

import type { AppSettings } from './types';

export async function getAppSettings(): Promise<AppSettings> {
  return getSettings();
}

export async function saveAppSettings(
  settings: AppSettings,
): Promise<AppSettings> {
  return updateSettings(settings);
}

export async function resetAppSettings(): Promise<AppSettings> {
  return resetSettings();
}
