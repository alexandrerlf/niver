-- A geração por IA saiu do app: o convite não guarda mais descrição, prompt nem tentativas de arte.

alter table public.invitations
  drop column description,
  drop column image_prompt,
  drop column art_attempts;

alter table public.invitations drop constraint invitations_status_check;
alter table public.invitations
  add constraint invitations_status_check check (status in ('draft', 'published'));
