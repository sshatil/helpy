create extension if not exists "pgcrypto";

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null
    references public.plans(id)
    on delete cascade,
  title text not null,
  duration integer not null,
  notes text,
  links text[] not null default '{}',
  task_order integer not null default 0,
  completed boolean not null default false,
  status text not null default 'ready'
    check (
      status in (
        'ready',
        'running',
        'paused',
        'completed'
      )
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_execution_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null,
  plan_id uuid not null,
  plan_title text not null,
  task_title text not null,
  planned_duration integer not null,
  started_at timestamptz not null,
  completed_at timestamptz not null,
  actual_duration integer not null,
  created_at timestamptz not null default now(),

  constraint task_execution_history_task_fk
    foreign key (task_id)
    references public.tasks(id)
    on delete cascade,

  constraint task_execution_history_plan_fk
    foreign key (plan_id)
    references public.plans(id)
    on delete cascade
);

create index if not exists tasks_plan_id_idx
on public.tasks(plan_id);

create index if not exists tasks_plan_order_idx
on public.tasks(plan_id, task_order);

create index if not exists history_task_id_idx
on public.task_execution_history(task_id);

create index if not exists history_plan_id_idx
on public.task_execution_history(plan_id);

create index if not exists history_completed_at_idx
on public.task_execution_history(completed_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists plans_set_updated_at on public.plans;

create trigger plans_set_updated_at
before update on public.plans
for each row
execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();



alter table public.plans enable row level security;
alter table public.tasks enable row level security;
alter table public.task_execution_history enable row level security;

create policy "development plans select"
on public.plans
for select
to anon, authenticated
using (true);

create policy "development plans insert"
on public.plans
for insert
to anon, authenticated
with check (true);

create policy "development plans update"
on public.plans
for update
to anon, authenticated
using (true)
with check (true);

create policy "development plans delete"
on public.plans
for delete
to anon, authenticated
using (true);

create policy "development tasks select"
on public.tasks
for select
to anon, authenticated
using (true);

create policy "development tasks insert"
on public.tasks
for insert
to anon, authenticated
with check (true);

create policy "development tasks update"
on public.tasks
for update
to anon, authenticated
using (true)
with check (true);

create policy "development tasks delete"
on public.tasks
for delete
to anon, authenticated
using (true);

create policy "development history select"
on public.task_execution_history
for select
to anon, authenticated
using (true);

create policy "development history insert"
on public.task_execution_history
for insert
to anon, authenticated
with check (true);

create policy "development history delete"
on public.task_execution_history
for delete
to anon, authenticated
using (true);