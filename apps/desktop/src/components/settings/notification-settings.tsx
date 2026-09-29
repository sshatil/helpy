import { Bell } from 'lucide-react';

import { Switch } from '@repo/ui/components/ui/switch';

import { useSettings } from '../../hooks/use-settings';

import { SettingsSection } from './settings-section';

export function NotificationSettings() {
  const { settings, updateSettings, isUpdating } = useSettings();

  const taskCompletion = settings?.notifications.taskCompletion ?? true;

  function handleTaskCompletionChange(checked: boolean) {
    if (!settings) {
      return;
    }

    updateSettings({
      ...settings,

      notifications: {
        ...settings.notifications,
        taskCompletion: checked,
      },
    });
  }

  return (
    <SettingsSection
      title='Notifications'
      description='Choose which notifications you want to receive.'
    >
      <div className='rounded-lg border'>
        <div className='flex items-center justify-between gap-4 p-4'>
          <div className='flex min-w-0 items-start gap-3'>
            <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
              <Bell className='size-4' />
            </div>

            <div>
              <p className='text-sm font-medium'>Task completion</p>

              <p className='text-muted-foreground mt-1 text-sm'>
                Receive a desktop notification when a task timer finishes.
              </p>
            </div>
          </div>

          <Switch
            checked={taskCompletion}
            disabled={!settings || isUpdating}
            onCheckedChange={handleTaskCompletionChange}
            aria-label='Task completion notifications'
          />
        </div>
      </div>
    </SettingsSection>
  );
}
