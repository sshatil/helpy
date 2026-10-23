import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export type AppUpdate = {
  version: string;
  date?: string;
  body?: string;
};

export async function checkForAppUpdate(): Promise<AppUpdate | null> {
  try {
    const update = await check();

    if (!update) {
      return null;
    }

    return {
      version: update.version,
      date: update.date,
      // body: update.body,
    };
  } catch (error) {
    console.error('Failed to check for app update:', error);
    throw error;
  }
}

export async function installAppUpdate(
  onProgress?: (progress: number) => void,
): Promise<void> {
  const update = await check();

  if (!update) {
    return;
  }

  let contentLength = 0;
  let downloaded = 0;

  await update.downloadAndInstall((event) => {
    switch (event.event) {
      case 'Started':
        contentLength = event.data.contentLength ?? 0;
        downloaded = 0;

        onProgress?.(0);
        break;

      case 'Progress':
        downloaded += event.data.chunkLength;

        if (contentLength > 0) {
          onProgress?.(Math.min(100, (downloaded / contentLength) * 100));
        }

        break;

      case 'Finished':
        onProgress?.(100);
        break;
    }
  });

  await relaunch();
}
