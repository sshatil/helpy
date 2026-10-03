-- ============================================================
-- HELPY - COMPLETE SUPABASE DATABASE SCHEMA
-- ============================================================
--
-- Includes:
--   1. Extensions
--   2. Plans
--   3. Tasks
--   4. Task execution history
--   5. Profiles
--   6. Public profiles
--   7. Public profile statistics
--   8. Public profile activity - last 1 year
--   9. Community profile search
--  10. Updated-at triggers
--  11. New-user profile creation
--  12. Existing-user profile backfill
--  13. Indexes
--  14. Row Level Security
--  15. RPC permissions
--
-- ============================================================


-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

create extension if not exists "pgcrypto";


-- ============================================================
-- 2. PLANS
-- ============================================================

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),

  title text not null,

  description text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade
);


-- ============================================================
-- 3. TASKS
-- ============================================================

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

  updated_at timestamptz not null default now(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade
);


-- ============================================================
-- 4. TASK EXECUTION HISTORY
-- ============================================================

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

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  constraint task_execution_history_task_fk
    foreign key (task_id)
    references public.tasks(id)
    on delete cascade,

  constraint task_execution_history_plan_fk
    foreign key (plan_id)
    references public.plans(id)
    on delete cascade
);


-- ============================================================
-- 5. PROFILES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  display_name text,

  username text unique,

  avatar_url text,

  bio text,

  is_public boolean not null default true,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint profiles_username_length
    check (
      username is null
      or char_length(username) between 3 and 30
    ),

  constraint profiles_username_format
    check (
      username is null
      or username ~ '^[a-zA-Z0-9_]+$'
    )
);


-- ============================================================
-- 6. INDEXES
-- ============================================================

-- Plans
create index if not exists plans_user_id_idx
on public.plans(user_id);


-- Tasks
create index if not exists tasks_user_id_idx
on public.tasks(user_id);

create index if not exists tasks_plan_id_idx
on public.tasks(plan_id);

create index if not exists tasks_plan_order_idx
on public.tasks(
  plan_id,
  task_order
);


-- Task execution history
create index if not exists history_user_id_idx
on public.task_execution_history(user_id);

create index if not exists history_task_id_idx
on public.task_execution_history(task_id);

create index if not exists history_plan_id_idx
on public.task_execution_history(plan_id);

create index if not exists history_completed_at_idx
on public.task_execution_history(completed_at);


-- Important composite index for public profile activity
create index if not exists history_user_completed_at_idx
on public.task_execution_history(
  user_id,
  completed_at
);


-- Profiles
create index if not exists profiles_username_idx
on public.profiles(username);


-- Public profile username lookup
create index if not exists profiles_public_username_idx
on public.profiles(username)
where is_public = true;


-- ============================================================
-- 7. UPDATED_AT TRIGGER FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  return new;
end;
$$;


-- ============================================================
-- 8. UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists plans_set_updated_at
on public.plans;

create trigger plans_set_updated_at
before update on public.plans
for each row
execute function public.set_updated_at();


drop trigger if exists tasks_set_updated_at
on public.tasks;

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();


drop trigger if exists profiles_set_updated_at
on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();


-- ============================================================
-- 9. CREATE PROFILE WHEN A NEW USER SIGNS UP
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin

  insert into public.profiles (
    id,
    display_name,
    avatar_url
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;

end;
$$;


drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- ============================================================
-- 10. BACKFILL PROFILES FOR EXISTING USERS
-- ============================================================

insert into public.profiles (
  id,
  display_name,
  avatar_url
)
select
  id,
  raw_user_meta_data ->> 'full_name',
  raw_user_meta_data ->> 'avatar_url'
from auth.users
where not exists (
  select 1
  from public.profiles
  where profiles.id = auth.users.id
);


-- ============================================================
-- 11. ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table public.plans
enable row level security;

alter table public.tasks
enable row level security;

alter table public.task_execution_history
enable row level security;

alter table public.profiles
enable row level security;


-- ============================================================
-- 12. PLANS RLS
-- ============================================================

drop policy if exists "users can view own plans"
on public.plans;

create policy "users can view own plans"
on public.plans
for select
to authenticated
using (
  user_id = (select auth.uid())
);


drop policy if exists "users can create own plans"
on public.plans;

create policy "users can create own plans"
on public.plans
for insert
to authenticated
with check (
  user_id = (select auth.uid())
);


drop policy if exists "users can update own plans"
on public.plans;

create policy "users can update own plans"
on public.plans
for update
to authenticated
using (
  user_id = (select auth.uid())
)
with check (
  user_id = (select auth.uid())
);


drop policy if exists "users can delete own plans"
on public.plans;

create policy "users can delete own plans"
on public.plans
for delete
to authenticated
using (
  user_id = (select auth.uid())
);


-- ============================================================
-- 13. TASKS RLS
-- ============================================================

drop policy if exists "users can view own tasks"
on public.tasks;

create policy "users can view own tasks"
on public.tasks
for select
to authenticated
using (
  user_id = (select auth.uid())
);


drop policy if exists "users can create own tasks"
on public.tasks;

create policy "users can create own tasks"
on public.tasks
for insert
to authenticated
with check (
  user_id = (select auth.uid())
);


drop policy if exists "users can update own tasks"
on public.tasks;

create policy "users can update own tasks"
on public.tasks
for update
to authenticated
using (
  user_id = (select auth.uid())
)
with check (
  user_id = (select auth.uid())
);


drop policy if exists "users can delete own tasks"
on public.tasks;

create policy "users can delete own tasks"
on public.tasks
for delete
to authenticated
using (
  user_id = (select auth.uid())
);


-- ============================================================
-- 14. TASK EXECUTION HISTORY RLS
-- ============================================================

drop policy if exists "users can view own history"
on public.task_execution_history;

create policy "users can view own history"
on public.task_execution_history
for select
to authenticated
using (
  user_id = (select auth.uid())
);


drop policy if exists "users can create own history"
on public.task_execution_history;

create policy "users can create own history"
on public.task_execution_history
for insert
to authenticated
with check (
  user_id = (select auth.uid())
);


drop policy if exists "users can update own history"
on public.task_execution_history;

create policy "users can update own history"
on public.task_execution_history
for update
to authenticated
using (
  user_id = (select auth.uid())
)
with check (
  user_id = (select auth.uid())
);


drop policy if exists "users can delete own history"
on public.task_execution_history;

create policy "users can delete own history"
on public.task_execution_history
for delete
to authenticated
using (
  user_id = (select auth.uid())
);


-- ============================================================
-- 15. PROFILE RLS
-- ============================================================

-- Remove old owner-only SELECT policy
drop policy if exists "users can view own profile"
on public.profiles;


-- Public profiles can be viewed by everyone.
-- Private profiles can still be viewed by their owner.
drop policy if exists "public profiles are viewable"
on public.profiles;

create policy "public profiles are viewable"
on public.profiles
for select
to anon, authenticated
using (
  is_public = true
  or (select auth.uid()) = id
);


-- ============================================================
-- 16. PROFILE INSERT POLICY
-- ============================================================

drop policy if exists "users can create own profile"
on public.profiles;

create policy "users can create own profile"
on public.profiles
for insert
to authenticated
with check (
  id = (select auth.uid())
);


-- ============================================================
-- 17. PROFILE UPDATE POLICY
-- ============================================================

drop policy if exists "users can update own profile"
on public.profiles;

create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
)
with check (
  id = (select auth.uid())
);


-- ============================================================
-- 18. PROFILE DELETE POLICY
-- ============================================================

drop policy if exists "users can delete own profile"
on public.profiles;

create policy "users can delete own profile"
on public.profiles
for delete
to authenticated
using (
  id = (select auth.uid())
);


-- ============================================================
-- 19. PUBLIC PROFILE RPC
-- ============================================================
--
-- Returns:
--
-- profile
--   public profile information
--
-- statistics
--   ALL-TIME statistics
--
-- activity
--   ONLY the most recent 1 year
--
-- Raw plans/tasks/history are never exposed.
--
-- ============================================================

create or replace function public.get_public_profile(
  profile_username text
)
returns json
language sql
security definer
set search_path = ''
stable
as $$

  select json_build_object(

    -- --------------------------------------------------------
    -- PUBLIC PROFILE
    -- --------------------------------------------------------

    'profile',
    json_build_object(
      'id',
      p.id,

      'display_name',
      p.display_name,

      'username',
      p.username,

      'avatar_url',
      p.avatar_url,

      'bio',
      p.bio,

      'created_at',
      p.created_at
    ),


    -- --------------------------------------------------------
    -- ALL-TIME STATISTICS
    -- --------------------------------------------------------

    'statistics',
    json_build_object(

      'completed_tasks',
      (
        select count(*)
        from public.task_execution_history h
        where h.user_id = p.id
      ),


      'total_focus_minutes',
      (
        select coalesce(
          sum(h.actual_duration),
          0
        )
        from public.task_execution_history h
        where h.user_id = p.id
      ),


      'active_days',
      (
        select count(
          distinct h.completed_at::date
        )
        from public.task_execution_history h
        where h.user_id = p.id
      ),


      'plans_created',
      (
        select count(*)
        from public.plans pl
        where pl.user_id = p.id
      )

    ),


    -- --------------------------------------------------------
    -- ACTIVITY
    -- LAST 1 YEAR ONLY
    -- --------------------------------------------------------

    'activity',
    (
      select coalesce(

        json_agg(

          json_build_object(

            'date',
            activity.date,

            'count',
            activity.count,

            'minutes',
            activity.minutes

          )

          order by activity.date

        ),

        '[]'::json

      )

      from (

        select

          h.completed_at::date as date,

          count(*)::integer as count,

          coalesce(
            sum(h.actual_duration),
            0
          )::integer as minutes

        from public.task_execution_history h

        where h.user_id = p.id

          -- Only activity from the last year
          and h.completed_at >=
            now() - interval '1 year'

        group by h.completed_at::date

        order by h.completed_at::date

      ) activity

    )

  )

  from public.profiles p

  where lower(p.username) =
        lower(profile_username)

    and p.is_public = true

  limit 1;

$$;


-- ============================================================
-- 20. PUBLIC PROFILE RPC PERMISSIONS
-- ============================================================

revoke execute
on function public.get_public_profile(text)
from public;


grant execute
on function public.get_public_profile(text)
to anon, authenticated;


-- ============================================================
-- 21. COMMUNITY PUBLIC PROFILE SEARCH
-- ============================================================
--
-- Search by:
--   username
--   display name
--
-- Maximum:
--   20 results
--
-- Only public profiles are returned.
--
-- ============================================================

create or replace function public.search_public_profiles(
  search_query text
)
returns table (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  bio text
)
language sql
security definer
set search_path = ''
stable
as $$

  select

    p.id,

    p.username,

    p.display_name,

    p.avatar_url,

    p.bio

  from public.profiles p

  where p.is_public = true

    and p.username is not null

    and (
      p.username ilike
        '%' || trim(search_query) || '%'

      or p.display_name ilike
        '%' || trim(search_query) || '%'
    )

  order by
    p.username asc

  limit 20;

$$;


-- ============================================================
-- 22. COMMUNITY SEARCH RPC PERMISSIONS
-- ============================================================

revoke execute
on function public.search_public_profiles(text)
from public;


grant execute
on function public.search_public_profiles(text)
to anon, authenticated;


-- ============================================================
-- 23. FINAL SCHEMA CHECKS
-- ============================================================

-- Make sure RLS is enabled even if this script is rerun.

alter table public.plans
enable row level security;

alter table public.tasks
enable row level security;

alter table public.task_execution_history
enable row level security;

alter table public.profiles
enable row level security;


-- ============================================================
-- END OF HELPY SUPABASE SCHEMA
-- ============================================================
