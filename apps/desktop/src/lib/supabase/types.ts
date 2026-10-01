import type { Database } from './database.types';

export type PlanRow = Database['public']['Tables']['plans']['Row'];

export type PlanInsert = Database['public']['Tables']['plans']['Insert'];

export type PlanUpdate = Database['public']['Tables']['plans']['Update'];

export type TaskRow = Database['public']['Tables']['tasks']['Row'];

export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];

export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type HistoryRow =
  Database['public']['Tables']['task_execution_history']['Row'];

export type HistoryInsert =
  Database['public']['Tables']['task_execution_history']['Insert'];
