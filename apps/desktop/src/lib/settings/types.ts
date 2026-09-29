export type AppTheme = 'system' | 'light' | 'dark';

export type AppSettings = {
  notifications: {
    taskCompletion: boolean;
  };

  appearance: {
    theme: AppTheme;
  };
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  notifications: {
    taskCompletion: true,
  },

  appearance: {
    theme: 'system',
  },
};
