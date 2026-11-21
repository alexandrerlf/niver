-- LGPD: consentimento do responsável pela criança, exclusão da conta pelo titular e prazo de guarda das presenças.

-- Data em que o responsável confirmou o uso do nome e da idade da criança no convite.
-- Gravada só na criação: o cliente não tem permissão de alterar a coluna depois.
alter table public.invitations add column guardian_consent_at timestamptz;

-- Exclui a conta de quem está logado: o e-mail sai das listas de liberação e o usuário é apagado.
-- Convites e presenças caem em cascata pelas chaves estrangeiras.
create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_id uuid := auth.uid();
  user_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if user_id is null then
    raise exception 'Sessão não encontrada.' using errcode = '28000';
  end if;

  if user_email <> '' then
    delete from public.template_access where email = user_email;
    delete from public.allowed_emails where email = user_email;
    delete from private.admins where email = user_email;
  end if;

  delete from auth.users where id = user_id;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Prazo de guarda: presenças são apagadas 6 meses depois da data da festa.
create function private.purge_old_rsvps()
returns integer
language sql
security definer
set search_path = ''
as $$
  with removed as (
    delete from public.rsvps r
    using public.invitations i
    where r.invitation_id = i.id
      and i.event_date < (now() at time zone 'America/Sao_Paulo')::date - interval '6 months'
    returning 1
  )
  select count(*)::integer from removed;
$$;

revoke all on function private.purge_old_rsvps() from public, anon, authenticated;

-- Índice para a rotina encontrar os convites antigos sem varrer a tabela inteira.
create index invitations_event_date_idx on public.invitations (event_date);

create extension if not exists pg_cron;

-- Todo dia às 06:00 UTC (03:00 em Brasília).
select cron.schedule('apagar-presencas-antigas', '0 6 * * *', 'select private.purge_old_rsvps()');
