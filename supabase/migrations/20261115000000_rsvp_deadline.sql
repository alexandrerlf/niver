-- Prazo para confirmar presença: depois do dia escolhido, o convite não aceita novas confirmações.

alter table public.invitations
  add column rsvp_deadline date
  constraint invitations_rsvp_deadline_check
  check (rsvp_deadline is null or event_date is null or rsvp_deadline <= event_date);

grant select (rsvp_deadline) on public.invitations to anon;
grant update (rsvp_deadline) on public.invitations to authenticated;

-- O prazo vale até o fim do dia no horário de Brasília.
drop policy "todos confirmam em convites publicados" on public.rsvps;

create policy "todos confirmam em convites publicados dentro do prazo" on public.rsvps
for insert to anon, authenticated
with check (
  exists (
    select 1
    from public.invitations i
    where i.id = invitation_id
      and i.status = 'published'
      and (
        i.rsvp_deadline is null
        or i.rsvp_deadline >= (now() at time zone 'America/Sao_Paulo')::date
      )
  )
);
