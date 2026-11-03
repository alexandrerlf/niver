-- Catálogo de modelos: o admin publica modelos e libera para todos ou por e-mail.

create table private.admins (
  email text primary key check (email = lower(email))
);

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- A lista sai do schema private para o admin gerenciar clientes pelo app.
alter table private.allowed_emails set schema public;
alter table public.allowed_emails enable row level security;
revoke all on public.allowed_emails from anon, authenticated;
grant select, insert, delete on public.allowed_emails to authenticated;

create policy "admins leem clientes" on public.allowed_emails
for select to authenticated
using ((select private.is_admin()));

create policy "admins adicionam clientes" on public.allowed_emails
for insert to authenticated
with check ((select private.is_admin()));

create policy "admins removem clientes" on public.allowed_emails
for delete to authenticated
using ((select private.is_admin()));

create or replace function private.is_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin() or exists (
    select 1
    from public.allowed_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  theme text not null default '' check (char_length(theme) <= 200),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  visibility text not null default 'all' check (visibility in ('all', 'selected')),
  html text not null default '' check (char_length(html) <= 200000),
  art_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.template_access (
  template_id uuid not null references public.templates (id) on delete cascade,
  email text not null check (email = lower(email)),
  primary key (template_id, email)
);

create trigger templates_set_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

alter table public.templates enable row level security;
alter table public.template_access enable row level security;

revoke all on public.templates, public.template_access from anon, authenticated;
grant select, insert, update on public.templates to authenticated;
grant select, insert, delete on public.template_access to authenticated;

create policy "admins e clientes liberados leem modelos" on public.templates
for select to authenticated
using (
  (select private.is_admin())
  or (
    status = 'published'
    and (select private.is_allowed())
    and (
      visibility = 'all'
      or exists (
        select 1
        from public.template_access a
        where a.template_id = id
          and a.email = lower(coalesce((select auth.jwt()) ->> 'email', ''))
      )
    )
  )
);

create policy "admins criam modelos" on public.templates
for insert to authenticated
with check ((select private.is_admin()));

create policy "admins editam modelos" on public.templates
for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admins e o próprio cliente leem liberações" on public.template_access
for select to authenticated
using (
  (select private.is_admin())
  or email = lower(coalesce((select auth.jwt()) ->> 'email', ''))
);

create policy "admins liberam modelos" on public.template_access
for insert to authenticated
with check ((select private.is_admin()));

create policy "admins removem liberações" on public.template_access
for delete to authenticated
using ((select private.is_admin()));

-- Cada convite guarda uma cópia do HTML: mudar o modelo não altera convites já enviados.
alter table public.invitations
  add column template_id uuid references public.templates (id) on delete set null;

create index invitations_template_idx on public.invitations (template_id);

alter table public.invitations drop constraint invitations_description_check;
alter table public.invitations
  alter column description set default '',
  add constraint invitations_description_check check (char_length(description) <= 6000);

update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'invitation-art';

-- Sem política de exclusão: a arte de um modelo segue em uso pelos convites criados com ele.
create policy "admins leem arte de modelos" on storage.objects
for select to authenticated
using (
  bucket_id = 'invitation-art'
  and (storage.foldername(name))[1] = 'templates'
  and (select private.is_admin())
);

create policy "admins enviam arte de modelos" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'invitation-art'
  and (storage.foldername(name))[1] = 'templates'
  and (select private.is_admin())
);
