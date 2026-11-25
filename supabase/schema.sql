-- ═══════════════════════════════════════════════════════════
--  The Lantern Hall · database
--  Paste this whole file into Supabase → SQL Editor → Run.
-- ═══════════════════════════════════════════════════════════

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_-]{2,24}$'),
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles on delete cascade,
  kind text not null check (kind in ('book','film','show','song')),
  status text not null check (status in ('done','want')),
  title text not null,
  creator text default '',
  year text default '',
  description text default '',
  cover text default '',
  genres text[] default '{}',
  link text default '',
  source text default '',
  extra jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists items_owner_idx on public.items(owner);

create table if not exists public.ratings (
  item_id uuid not null references public.items on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  stars int not null check (stars between 1 and 5),
  note text default '',
  created_at timestamptz not null default now(),
  primary key (item_id, user_id)
);

-- Everyone in the Hall can look at every shelf.
-- You can only change your own shelf and your own ratings.
alter table public.profiles enable row level security;
alter table public.items    enable row level security;
alter table public.ratings  enable row level security;

drop policy if exists "hall can see profiles" on public.profiles;
drop policy if exists "make own profile"      on public.profiles;
drop policy if exists "edit own profile"      on public.profiles;
create policy "hall can see profiles" on public.profiles for select using (true);
create policy "make own profile"      on public.profiles for insert with check (auth.uid() = id);
create policy "edit own profile"      on public.profiles for update using (auth.uid() = id);

drop policy if exists "hall can see items" on public.items;
drop policy if exists "add own items"      on public.items;
drop policy if exists "edit own items"     on public.items;
drop policy if exists "remove own items"   on public.items;
create policy "hall can see items" on public.items for select using (true);
create policy "add own items"      on public.items for insert with check (auth.uid() = owner);
create policy "edit own items"     on public.items for update using (auth.uid() = owner);
create policy "remove own items"   on public.items for delete using (auth.uid() = owner);

drop policy if exists "hall can see ratings" on public.ratings;
drop policy if exists "add own ratings"      on public.ratings;
drop policy if exists "edit own ratings"     on public.ratings;
drop policy if exists "remove own ratings"   on public.ratings;
create policy "hall can see ratings" on public.ratings for select using (true);
create policy "add own ratings"      on public.ratings for insert with check (auth.uid() = user_id);
create policy "edit own ratings"     on public.ratings for update using (auth.uid() = user_id);
create policy "remove own ratings"   on public.ratings for delete using (auth.uid() = user_id);

-- Build a bookcase (profile) automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    lower(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Comments: a conversation under any item, readable by the whole Hall.
-- You can delete your own comments.
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists comments_item_idx on public.comments(item_id);
alter table public.comments enable row level security;
drop policy if exists "hall can see comments" on public.comments;
drop policy if exists "add own comments"      on public.comments;
drop policy if exists "remove comments"       on public.comments;
create policy "hall can see comments" on public.comments for select using (true);
create policy "add own comments"      on public.comments for insert with check (auth.uid() = user_id);
create policy "remove comments"       on public.comments for delete using (auth.uid() = user_id);

-- Newer Supabase projects don't open tables to the website automatically.
-- The policies above still decide who may change what.
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
