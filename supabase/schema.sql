create table if not exists public.site_content (
  id text primary key check (id = 'main'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.site_content enable row level security;
alter table public.site_content_admins enable row level security;

grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;
revoke all on public.site_content_admins from anon;
grant select on public.site_content_admins to authenticated;

drop policy if exists "Anyone can read website content"
  on public.site_content;
create policy "Anyone can read website content"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert website content"
  on public.site_content;
create policy "Admins can insert website content"
  on public.site_content
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.site_content_admins
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update website content"
  on public.site_content;
create policy "Admins can update website content"
  on public.site_content
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.site_content_admins
      where user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.site_content_admins
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can view their own access"
  on public.site_content_admins;
create policy "Admins can view their own access"
  on public.site_content_admins
  for select
  to authenticated
  using (user_id = (select auth.uid()));
