import { useEffect, useState } from 'react';

import { checkForAppUpdate, type AppUpdate } from '../lib/updater';

export function useAppUpdate() {
  const [update, setUpdate] = useState<AppUpdate | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkUpdate() {
      setIsChecking(true);

      try {
        const availableUpdate = await checkForAppUpdate();

        if (!cancelled) {
          setUpdate(availableUpdate);
        }
      } catch (error) {
        console.error('Automatic update check failed:', error);
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    void checkUpdate();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    update,
    isChecking,
  };
}
