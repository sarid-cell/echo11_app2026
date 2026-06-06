-- ════════════════════════════════════════════════════════════
-- echo.11 · Supabase schema
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════

-- 1) FREQUENCIES ────────────────────────────────────────────
-- Catalog of the frequencies. Audio is synthesized on-device (Web Audio) —
-- there is no audio file / no storage. This table just drives the catalog.
create table if not exists public.frequencies (
  id          text primary key,            -- 'hz528', 'gamma', ...
  sort        int  not null default 0,
  name        text not null,
  sub         text,
  mode        text,                         -- focus | sleep | healing | abundance
  type        text not null,                -- 'binaural' | 'solfeggio'
  hz          numeric not null,
  c_l         numeric not null,             -- left carrier
  c_r         numeric not null,             -- right carrier
  beat        numeric,                      -- c_r - c_l (null for pure tones)
  premium     boolean not null default false,
  img         text
);

-- Public can READ the catalog; only service role writes it.
alter table public.frequencies enable row level security;
create policy "frequencies are readable by anyone"
  on public.frequencies for select using (true);

-- 2) PROFILES ───────────────────────────────────────────────
-- One row per auth user; tracks entitlement.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  is_premium  boolean not null default false,
  plan        text,                         -- 'yearly' | 'monthly' | null
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "users read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) SESSIONS ───────────────────────────────────────────────
-- Playback log → powers streaks & history.
create table if not exists public.sessions (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  frequency_id  text references public.frequencies(id),
  seconds       int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.sessions enable row level security;
create policy "users insert own sessions" on public.sessions for insert with check (auth.uid() = user_id or user_id is null);
create policy "users read own sessions"   on public.sessions for select using (auth.uid() = user_id);

-- 4) FAVORITES ──────────────────────────────────────────────
-- Which frequencies each user starred. One row per (user, frequency).
create table if not exists public.favorites (
  user_id       uuid references auth.users(id) on delete cascade,
  frequency_id  text not null,
  created_at    timestamptz not null default now(),
  primary key (user_id, frequency_id)
);

alter table public.favorites enable row level security;
create policy "users read own favorites"   on public.favorites for select using (auth.uid() = user_id);
create policy "users insert own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "users delete own favorites" on public.favorites for delete using (auth.uid() = user_id);
