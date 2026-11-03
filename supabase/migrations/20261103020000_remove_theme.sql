-- O tema só alimentava a geração por IA, que saiu do app.

alter table public.templates drop column theme;
alter table public.invitations drop column theme;
