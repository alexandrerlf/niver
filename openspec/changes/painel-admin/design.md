# Design

## Context

A área `/admin` já confere `is_admin()` no layout e redireciona quem não é admin. As tabelas `charges` e `invitations` só deixam cada conta ler o que é dela, e `auth.users` não é exposta. Motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Números confiáveis vindos do banco, com a permissão conferida no banco.
- Uma consulta só por carregamento da tela.

**Non-Goals:**
- Gráficos, filtros por período e exportação.
- Ver ou editar dados de clientes individuais.

## Decisions

- **Função `public.admin_overview()` no banco.** `security definer`, `search_path` vazio, executável por `authenticated`, que levanta erro quando `private.is_admin()` é falso. Devolve um JSON com os números e os últimos 10 pagamentos (sem e-mail do cliente: só data, valor, origem, nome e id do convite). Alternativa: ler com a chave secreta no servidor depois de conferir o admin na tela; descartada porque a regra do projeto é a permissão morar no banco.
- **Pagamentos contados.** Faturamento soma `amount_cents` de `charges` com `status = 'paid'` e `kind = 'pix'`. Cortesias contam `kind = 'cortesia'`. A cobrança de transição não entra.
- **Mês em Brasília.** O início do mês é calculado com `now() at time zone 'America/Sao_Paulo'`.
- **Tela.** Página de servidor em `/admin`, com cartões de número no padrão do painel do convite (`Stat`) e a lista de pagamentos em `.panel`. Valores com `formatPrice`.

## Risks / Trade-offs

- [Contas de teste entram nos números] → aceitável até o lançamento; o checklist já prevê apagar os dados de teste.
- [Função visível na API para qualquer conta logada] → ela recusa quem não é admin; o aviso do Supabase sobre funções `security definer` vale e é intencional, como na exclusão de conta.

## Migration Plan

1. Aplicar a migração com a função no Supabase, com aprovação do dono, antes do merge.
2. Merge e deploy.
Rollback: remover a página e a função numa migração nova.
