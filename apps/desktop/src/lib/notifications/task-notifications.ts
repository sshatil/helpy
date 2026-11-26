import { platform } from '@tauri-apps/plugin-os';
import { resolveResource } from '@tauri-apps/api/path';

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

export async function sendTaskCompletionNotification(taskTitle: string) {
  try {
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }

    if (!permissionGranted) return;

    const currentPlatform = platform();

    let sound: string;

    if (currentPlatform === 'windows') {
      sound = await resolveResource('resources/sounds/notification.wav');
    } else {
      sound = 'default';
    }

    await sendNotification({
      title: 'Task completed',
      body: `"${taskTitle}" is complete.`,
      sound,
    });
  } catch (error) {
    console.error('Failed to send task completion notification:', error);
  }
}
