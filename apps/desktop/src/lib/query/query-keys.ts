export const queryKeys = {
  plans: {
    all: ['plans'] as const,

    detail: (planId: string) => ['plans', planId] as const,
  },

  tasks: {
    all: (planId: string) => ['tasks', planId] as const,

    detail: (taskId: string) => ['tasks', 'detail', taskId] as const,
  },

  history: {
    all: ['history'] as const,
  },
} as const;
