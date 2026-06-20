-- SQL Schema for private AI learning progress tracking platform (Phase 2 - Normalized)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create 'users' table
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null check (role in ('admin', 'member')) default 'member',
  created_at timestamp with time zone default now() not null
);

-- 2. Create 'roadmap_months' table
create table public.roadmap_months (
  month integer primary key check (month >= 1),
  title text not null,
  goal text not null,
  created_at timestamp with time zone default now() not null
);

-- 3. Create 'roadmap_weeks' table
create table public.roadmap_weeks (
  month integer not null references public.roadmap_months(month) on delete cascade,
  week integer not null check (week >= 1),
  topics text[] not null,
  tools text[] not null,
  daily_practice text not null,
  project text not null,
  tip text not null,
  difficulty text not null default 'intermediate' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  resources jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default now() not null,
  primary key (month, week)
);

-- 4. Create 'roadmap_tasks' table
create table public.roadmap_tasks (
  id uuid primary key default gen_random_uuid(),
  month integer not null,
  week integer not null,
  day integer not null check (day >= 1 and day <= 7),
  title text not null,
  task_order integer not null,
  created_at timestamp with time zone default now() not null,
  foreign key (month, week) references public.roadmap_weeks(month, week) on delete cascade
);

-- 5. Create 'progress' table
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  task_id uuid not null references public.roadmap_tasks(id) on delete cascade,
  completed boolean not null default false,
  updated_at timestamp with time zone default now() not null,
  -- Ensure unique mapping to prevent duplicate entries
  constraint unique_user_task unique (user_id, task_id)
);

-- 6. Enable Row Level Security (RLS) on all tables
alter table public.users enable row level security;
alter table public.roadmap_months enable row level security;
alter table public.roadmap_weeks enable row level security;
alter table public.roadmap_tasks enable row level security;
alter table public.progress enable row level security;

-- 7. Define RLS policies

-- Users policies
create policy "Authenticated users can read user profiles"
  on public.users
  for select
  using (auth.role() = 'authenticated');

create policy "Users can update own row"
  on public.users
  for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.users
  for insert
  with check (auth.uid() = id);

-- Roadmap months policies
create policy "Roadmap months public read access"
  on public.roadmap_months
  for select
  using (true);

create policy "Admins can manage roadmap months"
  on public.roadmap_months
  for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Roadmap weeks policies
create policy "Roadmap weeks public read access"
  on public.roadmap_weeks
  for select
  using (true);

create policy "Admins can manage roadmap weeks"
  on public.roadmap_weeks
  for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Roadmap tasks policies
create policy "Roadmap tasks public read access"
  on public.roadmap_tasks
  for select
  using (true);

create policy "Admins can manage roadmap tasks"
  on public.roadmap_tasks
  for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Progress policies
create policy "Authenticated users can read progress rows"
  on public.progress
  for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own progress"
  on public.progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.progress
  for update
  using (auth.uid() = user_id);

-- 8. Trigger to automatically sync auth.users with public.users
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'member'
  );
  return new;
end;
$$;

-- Trigger definition
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. Trigger to protect user roles from client-side privilege escalation
create or replace function public.protect_user_role()
returns trigger
security definer
language plpgsql
as $$
declare
  caller_role text;
begin
  -- If the service_role key is used, allow the operation
  if auth.role() = 'service_role' then
    return new;
  end if;

  -- Get caller's role
  select role into caller_role from public.users where id = auth.uid();

  -- Enforce rules
  if tg_op = 'INSERT' then
    if new.role != 'member' and coalesce(caller_role, '') != 'admin' then
      new.role := 'member';
    end if;
  elsif tg_op = 'UPDATE' then
    if new.role != old.role and coalesce(caller_role, '') != 'admin' then
      new.role := old.role;
    end if;
  end if;

  return new;
end;
$$;

-- Create trigger
create trigger protect_user_role_trigger
  before insert or update on public.users
  for each row
  execute function public.protect_user_role();

