# Proposal

## Why

Com a cobrança no ar, o dono precisa acompanhar o negócio sem abrir o Supabase nem o Mercado Pago: quantas contas existem, quantos convites foram criados e estão no ar, quantos Pix caíram e quanto entrou no mês. Hoje a área de admin só tem "Modelos".

## What Changes

- Nova tela `/admin`, "Visão geral", só para quem está na lista de admins do banco (hoje, só o dono).
- Números: contas cadastradas (e novas nos últimos 30 dias), convites criados, convites no ar, Pix pagos no mês, faturamento do mês e do total, e cortesias.
- Lista dos últimos pagamentos: data, valor, origem (Pix ou cortesia) e o convite.
- Os dados vêm de uma função do banco que recusa quem não é admin, então a permissão fica no banco, não só na tela.
- "Visão geral" entra no menu do admin, antes de "Modelos".

## Capabilities

### New Capabilities
- `painel-admin`: visão geral do negócio para o admin, com números e últimos pagamentos.

### Modified Capabilities

## Impact

- **Banco:** migração com a função `public.admin_overview()` (`security definer`, recusa quem não é admin).
- **Código:** página `src/app/(app)/admin/page.tsx`, link no menu (`src/components/nav.tsx`), tipos e formatação em `src/lib`.
- **Sem dependências novas.**
