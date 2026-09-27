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

    if (!permissionGranted) {
      return;
    }

    await sendNotification({
      title: 'Task completed',
      body: `"${taskTitle}" is complete.`,
    });
  } catch (error) {
    console.error('Failed to send task completion notification:', error);
  }
}
