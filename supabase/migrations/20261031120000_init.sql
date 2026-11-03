-- Convites, confirmações de presença e arte, com acesso restrito a e-mails autorizados.

create schema if not exists private;

create table private.allowed_emails (
  email text primary key check (email = lower(email))
);

create function private.is_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.allowed_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function private.is_allowed() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_allowed() to authenticated;

-- O schema private não é exposto: o app consulta a autorização antes de gastar com IA.
create function public.can_create_invitations()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_allowed();
$$;

revoke all on function public.can_create_invitations() from public, anon;
grant execute on function public.can_create_invitations() to authenticated;

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  status text not null default 'draft' check (status in ('draft', 'art_ready', 'published')),
  description text not null check (char_length(description) between 1 and 6000),
  theme text not null default '' check (char_length(theme) <= 200),
  child_name text not null default '' check (char_length(child_name) <= 120),
  age smallint check (age between 0 and 120),
  event_date date,
  event_time text check (event_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  location_name text not null default '' check (char_length(location_name) <= 200),
  maps_url text check (maps_url ~ '^https://'),
  message text not null default '' check (char_length(message) <= 500),
  gifts text[] not null default '{}',
  image_prompt text not null default '',
  image_path text,
  art_attempts smallint not null default 0 check (art_attempts between 0 and 5),
  html_template text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index invitations_owner_created_idx on public.invitations (owner_id, created_at desc);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  guest_name text not null check (char_length(guest_name) between 1 and 120),
  party_size smallint not null check (party_size between 1 and 20),
  created_at timestamptz not null default now()
);

create index rsvps_invitation_created_idx on public.rsvps (invitation_id, created_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create trigger invitations_set_updated_at
before update on public.invitations
for each row execute function public.set_updated_at();

alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;

revoke all on public.invitations, public.rsvps from anon, authenticated;

-- Convidados só leem o necessário para exibir o convite publicado.
grant select (
  id, slug, status, child_name, age, event_date, event_time,
  location_name, maps_url, message, gifts, image_path, html_template
) on public.invitations to anon;
grant select, insert, update, delete on public.invitations to authenticated;
grant insert (invitation_id, guest_name, party_size) on public.rsvps to anon, authenticated;
grant select, delete on public.rsvps to authenticated;

create policy "dono lê seus convites" on public.invitations
for select to authenticated
using ((select auth.uid()) = owner_id);

create policy "todos leem convites publicados" on public.invitations
for select to anon, authenticated
using (status = 'published');

create policy "autorizados criam convites" on public.invitations
for insert to authenticated
with check ((select auth.uid()) = owner_id and (select private.is_allowed()));

create policy "autorizados editam seus convites" on public.invitations
for update to authenticated
using ((select auth.uid()) = owner_id and (select private.is_allowed()))
with check ((select auth.uid()) = owner_id and (select private.is_allowed()));

create policy "dono exclui seus convites" on public.invitations
for delete to authenticated
using ((select auth.uid()) = owner_id);

create policy "todos confirmam em convites publicados" on public.rsvps
for insert to anon, authenticated
with check (
  exists (
    select 1
    from public.invitations i
    where i.id = invitation_id and i.status = 'published'
  )
);

create policy "dono lê confirmações" on public.rsvps
for select to authenticated
using (
  exists (
    select 1
    from public.invitations i
    where i.id = invitation_id and i.owner_id = (select auth.uid())
  )
);

create policy "dono exclui confirmações" on public.rsvps
for delete to authenticated
using (
  exists (
    select 1
    from public.invitations i
    where i.id = invitation_id and i.owner_id = (select auth.uid())
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invitation-art', 'invitation-art', true, 8388608, array['image/jpeg']);

create policy "dono lê sua arte" on storage.objects
for select to authenticated
using (
  bucket_id = 'invitation-art'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "autorizados enviam arte" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'invitation-art'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select private.is_allowed())
);

create policy "dono exclui sua arte" on storage.objects
for delete to authenticated
using (
  bucket_id = 'invitation-art'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
