# Tasks

## 1. Banco

- [ ] 1.1 Migração com `public.admin_overview()`, que recusa quem não é admin e devolve contas, convites, Pix, faturamento, cortesias e últimos 10 pagamentos (verificar num banco de teste: admin recebe os números certos; cliente recebe erro; cortesia e transição não entram no faturamento)

## 2. Tela

- [ ] 2.1 Tipos e formatação dos números em `src/lib/admin-overview.ts`, com teste do faturamento e da lista vazia (verificar com `npm run check`)
- [ ] 2.2 Página `/admin` com os cartões de número e os últimos pagamentos, e "Visão geral" no menu do admin antes de "Modelos" (verificar em 390 px e 1280 px, temas claro e escuro; conta comum vai para `/convites`)
- [ ] 2.3 Revisar a tela com `web-design-guidelines` e rodar `npm run check`, `npm run specs` e `npm run build`

## Workflow follow-up

- Aplicar a migração no Supabase de produção antes do merge, com aprovação do dono.
- Arquivar a mudança com `openspec-archive-change` depois do merge.
