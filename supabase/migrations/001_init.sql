-- TEAZ starter schema for Supabase. Review and run in a new Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  audience text not null default 'all',
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(12,2) not null check (price >= 0),
  old_price numeric(12,2) check (old_price is null or old_price >= 0),
  currency text not null default 'BRL',
  store text not null,
  product_url text not null,
  affiliate_url text,
  image_url text not null,
  category_id uuid references public.categories(id) on delete set null,
  style text,
  sizes text[] not null default '{}',
  verified_at timestamptz,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.looks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  style text,
  occasion text,
  image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.look_items (
  look_id uuid not null references public.looks(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order int not null default 0,
  primary key (look_id, product_id)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  store text not null,
  description text,
  valid_from timestamptz,
  valid_until timestamptz,
  verified_at timestamptz,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.click_events (
  id bigint generated always as identity primary key,
  product_id uuid references public.products(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.is_teaz_admin()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.looks enable row level security;
alter table public.look_items enable row level security;
alter table public.coupons enable row level security;
alter table public.favorites enable row level security;
alter table public.click_events enable row level security;

create policy "profiles_read_self_or_admin" on public.profiles
for select using (id = auth.uid() or public.is_teaz_admin());
create policy "profiles_admin_manage" on public.profiles
for all using (public.is_teaz_admin()) with check (public.is_teaz_admin());

create policy "categories_public_read" on public.categories
for select using (true);
create policy "categories_admin_write" on public.categories
for all using (public.is_teaz_admin()) with check (public.is_teaz_admin());

create policy "products_public_read_active" on public.products
for select using (active = true or public.is_teaz_admin());
create policy "products_admin_write" on public.products
for all using (public.is_teaz_admin()) with check (public.is_teaz_admin());

create policy "looks_public_read_published" on public.looks
for select using (published = true or public.is_teaz_admin());
create policy "looks_admin_write" on public.looks
for all using (public.is_teaz_admin()) with check (public.is_teaz_admin());

create policy "look_items_public_read" on public.look_items
for select using (
  exists (select 1 from public.looks l where l.id = look_id and (l.published = true or public.is_teaz_admin()))
);
create policy "look_items_admin_write" on public.look_items
for all using (public.is_teaz_admin()) with check (public.is_teaz_admin());

create policy "coupons_public_read_active" on public.coupons
for select using (active = true and (valid_until is null or valid_until > now()) or public.is_teaz_admin());
create policy "coupons_admin_write" on public.coupons
for all using (public.is_teaz_admin()) with check (public.is_teaz_admin());

create policy "favorites_owner_read" on public.favorites
for select using (user_id = auth.uid() or public.is_teaz_admin());
create policy "favorites_owner_write" on public.favorites
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "click_events_owner_or_admin_read" on public.click_events
for select using (user_id = auth.uid() or public.is_teaz_admin());
create policy "click_events_insert" on public.click_events
for insert with check (user_id is null or user_id = auth.uid());

-- Promote the first owner manually after signing up:
-- update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';
-- Only run this statement from the Supabase SQL editor as the project owner.
