-- Cobrança por Pix: só o servidor publica, depois do pagamento ou por cortesia do admin.
-- O convite fica no ar até 7 dias depois da festa, e qualquer conta confirmada cria convites.

-- Validade -------------------------------------------------------------------------------

alter table public.invitations
  add column paid_at timestamptz,
  add column expires_at timestamptz,
  -- Teto da validade quando a festa muda de data: 90 dias depois do pagamento,
  -- ou a validade original, se ela já passava disso.
  add column expires_cap timestamptz;

alter table public.invitations drop constraint invitations_status_check;
alter table public.invitations
  add constraint invitations_status_check check (status in ('draft', 'published', 'archived'));

-- Fim do dia, em Brasília, de 7 dias depois da festa ou do pagamento, o que for mais tarde.
create function private.expiry_for(event_date date, paid_at timestamptz)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select (greatest(coalesce(event_date, paid_day), paid_day) + 8)::timestamp at time zone 'America/Sao_Paulo'
  from (select (paid_at at time zone 'America/Sao_Paulo')::date as paid_day) as p;
$$;

-- Fim do dia, em Brasília, de 90 dias depois do pagamento.
create function private.expiry_cap(paid_at timestamptz)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select (((paid_at at time zone 'America/Sao_Paulo')::date + 91)::timestamp at time zone 'America/Sao_Paulo');
$$;

-- Cobranças -----------------------------------------------------------------------------

create table public.charges (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('pix', 'cortesia', 'transicao')),
  amount_cents integer not null check (amount_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'expired', 'failed')),
  mp_order_id text unique,
  pix_code text,
  pix_qr_base64 text,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index charges_invitation_created_idx on public.charges (invitation_id, created_at desc);
create index charges_owner_idx on public.charges (owner_id);

alter table public.charges enable row level security;
revoke all on public.charges from anon, authenticated;
grant select on public.charges to authenticated;
grant all on public.charges to service_role;

create policy "dono lê suas cobranças" on public.charges
for select to authenticated
using ((select auth.uid()) = owner_id);

-- O cliente não publica nem troca o HTML do modelo ---------------------------------------

revoke update (status, html_template) on public.invitations from authenticated;

-- Na criação, o convite é sempre rascunho, com o HTML e a arte do modelo escolhido.
create function private.prepare_new_invitation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  chosen record;
begin
  select t.html, t.art_path into chosen
  from public.templates t
  where t.id = new.template_id
    and t.status = 'published'
    and t.art_path is not null
    and (
      t.visibility = 'all'
      or private.is_admin()
      or exists (select 1 from public.template_access a where a.template_id = t.id and a.email = user_email)
    );

  if not found then
    raise exception 'Este modelo não está disponível.' using errcode = '42501';
  end if;

  new.html_template := chosen.html;
  new.image_path := chosen.art_path;
  new.status := 'draft';
  new.paid_at := null;
  new.expires_at := null;
  new.expires_cap := null;
  return new;
end;
$$;

create trigger invitations_prepare_new
before insert on public.invitations
for each row execute function private.prepare_new_invitation();

-- Festa mudou de data: a validade acompanha, até o teto.
create function private.follow_event_date()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.event_date is distinct from old.event_date and new.paid_at is not null and new.expires_cap is not null then
    new.expires_at := least(private.expiry_for(new.event_date, new.paid_at), new.expires_cap);
  end if;
  return new;
end;
$$;

create trigger invitations_follow_event_date
before update of event_date on public.invitations
for each row execute function private.follow_event_date();

-- Cadastro aberto ------------------------------------------------------------------------

drop policy "autorizados criam convites" on public.invitations;
create policy "contas criam convites" on public.invitations
for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy "autorizados editam seus convites" on public.invitations;
create policy "dono edita convites ativos" on public.invitations
for update to authenticated
using (
  (select auth.uid()) = owner_id
  and (status = 'draft' or (status = 'published' and expires_at > now()))
)
with check ((select auth.uid()) = owner_id);

drop policy "admins e clientes liberados leem modelos" on public.templates;
create policy "contas leem modelos liberados" on public.templates
for select to authenticated
using (
  (select private.is_admin())
  or (
    status = 'published'
    and (
      visibility = 'all'
      or exists (
        select 1
        from public.template_access a
        where a.template_id = templates.id
          and a.email = lower(coalesce((select auth.jwt()) ->> 'email', ''))
      )
    )
  )
);

create or replace function public.can_create_invitations()
returns boolean
language sql
stable
set search_path = ''
as $$
  select auth.uid() is not null;
$$;

-- Link público e confirmação só dentro da validade ---------------------------------------

-- O visitante lê só algumas colunas do convite; as políticas abaixo precisam também da validade.
grant select (expires_at) on public.invitations to anon;

drop policy "todos leem convites publicados" on public.invitations;
create policy "todos leem convites no ar" on public.invitations
for select to anon, authenticated
using (status = 'published' and expires_at > now());

drop policy "todos confirmam em convites publicados dentro do prazo" on public.rsvps;
create policy "todos confirmam em convites no ar dentro do prazo" on public.rsvps
for insert to anon, authenticated
with check (
  exists (
    select 1
    from public.invitations i
    where i.id = invitation_id
      and i.status = 'published'
      and i.expires_at > now()
      and (i.rsvp_deadline is null or i.rsvp_deadline >= (now() at time zone 'America/Sao_Paulo')::date)
  )
);

-- Publicação, só pelo servidor -----------------------------------------------------------

-- Marca a cobrança como paga e coloca o convite no ar. Repetir não muda nada.
create function public.publish_invitation(p_charge_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  charge public.charges;
  invitation public.invitations;
  paid timestamptz := now();
  expiry timestamptz;
begin
  select * into charge from public.charges where id = p_charge_id for update;
  if not found then
    raise exception 'Cobrança não encontrada.' using errcode = 'P0002';
  end if;
  if charge.status = 'paid' then
    return;
  end if;

  select * into invitation from public.invitations where id = charge.invitation_id for update;
  if invitation.child_name = '' or invitation.event_date is null or invitation.event_time is null
     or invitation.location_name = '' or invitation.html_template is null then
    raise exception 'Preencha nome, data, horário e local antes de publicar.' using errcode = '22023';
  end if;

  expiry := private.expiry_for(invitation.event_date, paid);

  update public.charges set status = 'paid', paid_at = paid where id = charge.id;
  update public.invitations
  set status = 'published',
      paid_at = paid,
      expires_at = expiry,
      expires_cap = greatest(expiry, private.expiry_cap(paid))
  where id = invitation.id;
end;
$$;

revoke all on function public.publish_invitation(uuid) from public, anon, authenticated;
grant execute on function public.publish_invitation(uuid) to service_role;

-- Arquivamento ---------------------------------------------------------------------------

create function private.archive_expired_invitations()
returns integer
language sql
security definer
set search_path = ''
as $$
  with archived as (
    update public.invitations
    set status = 'archived'
    where status = 'published' and expires_at <= now()
    returning 1
  )
  select count(*)::integer from archived;
$$;

revoke all on function private.archive_expired_invitations() from public, anon, authenticated;

create index invitations_status_expires_idx on public.invitations (status, expires_at);

-- Convites que já estavam no ar: 7 dias depois da festa, e pelo menos 7 dias a partir de hoje.
insert into public.charges (invitation_id, owner_id, kind, amount_cents, status, paid_at)
select id, owner_id, 'transicao', 0, 'paid', now()
from public.invitations
where status = 'published';

update public.invitations
set paid_at = now(),
    expires_at = private.expiry_for(event_date, now()),
    expires_cap = greatest(private.expiry_for(event_date, now()), private.expiry_cap(now()))
where status = 'published';

-- Todo dia às 06:15 UTC (03:15 em Brasília), depois da limpeza das presenças.
select cron.schedule('arquivar-convites-vencidos', '15 6 * * *', 'select private.archive_expired_invitations()');
