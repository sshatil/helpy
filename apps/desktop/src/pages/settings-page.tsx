import { Settings } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

import { NotificationSettings } from '../components/settings/notification-settings';
import { AppearanceSettings } from '../components/settings/appearance-settings';

export default function SettingsPage() {
  return (
    <div className='mx-auto w-full max-w-3xl space-y-8'>
      <div>
        <div className='flex items-center gap-3'>
          <div className='bg-muted flex size-10 items-center justify-center rounded-lg'>
            <Settings className='size-5' />
          </div>

          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Settings</h1>

            <p className='text-muted-foreground text-sm'>
              Manage your application preferences.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>

          <CardDescription>
            Customize notifications and appearance.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-8'>
          <NotificationSettings />

          <AppearanceSettings />
        </CardContent>
      </Card>
    </div>
  );
}
