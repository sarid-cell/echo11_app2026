-- Optional accounts. Listening notes are private to the signed-in person.
-- The free Supabase plan is enough. No extra extensions.
-- Logged-out visitors (anon) have no policy, so the API returns nothing for them.
-- Another signed-in user fails the user_id = auth.uid() check.

create table if not exists public.listening_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_key text not null,
  name text not null,
  hz text,
  category text,
  minutes integer,
  listened_at timestamptz not null,
  feel text,
  unique (user_id, client_key)
);

create index if not exists listening_history_user_time
  on public.listening_history (user_id, listened_at desc);

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  primary key (user_id, name)
);

create table if not exists public.resume_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text,
  hz text,
  category text,
  elapsed numeric,
  session_seconds numeric,
  updated_at timestamptz not null default now()
);

create table if not exists public.breath_streak (
  user_id uuid primary key references auth.users (id) on delete cascade,
  days integer not null default 0,
  last_day text,
  updated_at timestamptz not null default now()
);

alter table public.listening_history enable row level security;
alter table public.bookmarks enable row level security;
alter table public.resume_state enable row level security;
alter table public.breath_streak enable row level security;

alter table public.listening_history force row level security;
alter table public.bookmarks force row level security;
alter table public.resume_state force row level security;
alter table public.breath_streak force row level security;

revoke all on table public.listening_history from public, anon;
revoke all on table public.bookmarks from public, anon;
revoke all on table public.resume_state from public, anon;
revoke all on table public.breath_streak from public, anon;

grant select, insert, update, delete on table public.listening_history to authenticated;
grant select, insert, update, delete on table public.bookmarks to authenticated;
grant select, insert, update, delete on table public.resume_state to authenticated;
grant select, insert, update, delete on table public.breath_streak to authenticated;

-- listening_history
create policy listening_history_select_own
  on public.listening_history
  for select
  to authenticated
  using (user_id = auth.uid());

create policy listening_history_insert_own
  on public.listening_history
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy listening_history_update_own
  on public.listening_history
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy listening_history_delete_own
  on public.listening_history
  for delete
  to authenticated
  using (user_id = auth.uid());

-- bookmarks
create policy bookmarks_select_own
  on public.bookmarks
  for select
  to authenticated
  using (user_id = auth.uid());

create policy bookmarks_insert_own
  on public.bookmarks
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy bookmarks_update_own
  on public.bookmarks
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy bookmarks_delete_own
  on public.bookmarks
  for delete
  to authenticated
  using (user_id = auth.uid());

-- resume_state
create policy resume_state_select_own
  on public.resume_state
  for select
  to authenticated
  using (user_id = auth.uid());

create policy resume_state_insert_own
  on public.resume_state
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy resume_state_update_own
  on public.resume_state
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy resume_state_delete_own
  on public.resume_state
  for delete
  to authenticated
  using (user_id = auth.uid());

-- breath_streak
create policy breath_streak_select_own
  on public.breath_streak
  for select
  to authenticated
  using (user_id = auth.uid());

create policy breath_streak_insert_own
  on public.breath_streak
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy breath_streak_update_own
  on public.breath_streak
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy breath_streak_delete_own
  on public.breath_streak
  for delete
  to authenticated
  using (user_id = auth.uid());
