import { Laptop, Moon, Sun } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';

import { useSettings } from '../../hooks/use-settings';

import type { AppTheme } from '../../lib/settings/types';

import { SettingsSection } from './settings-section';

const THEME_OPTIONS: {
  value: AppTheme;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    value: 'system',
    label: 'System',
    description: 'Follow your operating system preference.',
    icon: Laptop,
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Use the light appearance.',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Use the dark appearance.',
    icon: Moon,
  },
];

export function AppearanceSettings() {
  const { settings, updateSettings, isUpdating } = useSettings();

  const theme = settings?.appearance.theme ?? 'system';

  function handleThemeChange(value: string) {
    if (!settings) {
      return;
    }

    updateSettings({
      ...settings,

      appearance: {
        ...settings.appearance,
        theme: value as AppTheme,
      },
    });
  }

  const selectedTheme = THEME_OPTIONS.find((option) => option.value === theme);

  const SelectedIcon = selectedTheme?.icon ?? Laptop;

  return (
    <SettingsSection
      title='Appearance'
      description='Choose how the application looks.'
    >
      <div className='rounded-lg border'>
        <div className='flex items-center justify-between gap-4 p-4'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
              <SelectedIcon className='size-4' />
            </div>

            <div>
              <p className='text-sm font-medium'>Theme</p>

              <p className='text-muted-foreground mt-1 text-sm'>
                {selectedTheme?.description}
              </p>
            </div>
          </div>

          <Select
            value={theme}
            onValueChange={handleThemeChange}
            disabled={!settings || isUpdating}
          >
            <SelectTrigger className='w-[130px]'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {THEME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingsSection>
  );
}
