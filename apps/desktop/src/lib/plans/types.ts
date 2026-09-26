export type Plan = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  planId: string;
  title: string;
  duration: number;
  notes?: string;
  links: string[];
  order: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};
