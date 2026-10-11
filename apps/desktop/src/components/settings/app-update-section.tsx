import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import {
  AppUpdate,
  checkForAppUpdate,
  installAppUpdate,
} from '../../lib/updater';

export function AppUpdateSection() {
  const [isChecking, setIsChecking] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [update, setUpdate] = useState<AppUpdate | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCheckForUpdates() {
    setIsChecking(true);
    setMessage(null);

    try {
      const availableUpdate = await checkForAppUpdate();

      setUpdate(availableUpdate);

      if (!availableUpdate) {
        setMessage('You are using the latest version.');
      }
    } catch {
      setMessage('Unable to check for updates. Please try again later.');
    } finally {
      setIsChecking(false);
    }
  }

  async function handleInstallUpdate() {
    setIsInstalling(true);
    setMessage(null);
    setProgress(0);

    try {
      await installAppUpdate(setProgress);
    } catch (error) {
      console.error('Failed to install update:', error);

      setMessage('The update could not be installed. Please try again.');
      setIsInstalling(false);
    }
  }

  return (
    <section className='space-y-4'>
      <div>
        <h2 className='text-lg font-semibold'>Updates</h2>
        <p className='text-muted-foreground text-sm'>
          Keep Helpy up to date with the latest improvements and fixes.
        </p>
      </div>

      <div className='rounded-lg border p-4'>
        {update ? (
          <div className='space-y-4'>
            <div>
              <p className='font-medium'>Helpy {update.version} is available</p>

              {update.body ? (
                <p className='text-muted-foreground mt-1 text-sm whitespace-pre-wrap'>
                  {update.body}
                </p>
              ) : null}
            </div>

            {isInstalling ? (
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span>Installing update...</span>
                  <span>{Math.round(progress)}%</span>
                </div>

                <div className='bg-muted h-2 overflow-hidden rounded-full'>
                  <div
                    className='bg-primary h-full transition-all'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <Button onClick={handleInstallUpdate}>Update now</Button>
            )}
          </div>
        ) : (
          <div className='space-y-3'>
            {message ? (
              <p className='text-muted-foreground text-sm'>{message}</p>
            ) : null}

            <Button
              variant='outline'
              onClick={handleCheckForUpdates}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Check for updates'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
