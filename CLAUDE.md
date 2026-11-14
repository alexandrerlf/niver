# Niver

PWA para criar convites de aniversário interativos a partir de um catálogo de modelos. O admin publica modelos (arte + HTML), o cliente preenche os dados da festa e compartilha o link `/c/<slug>`, e os convidados confirmam presença.

@AGENTS.md

## Comandos

- `npm run dev`: servidor local. Precisa de `.env.local` com o Supabase (veja `.env.example`).
- `npm run check`: typecheck e testes. Rode antes de todo commit.
- `npm run build`: build de produção. Rode quando mexer em rotas, `next.config.ts` ou dependências.

## Stack

Next.js 16 (App Router, React 19), Tailwind 4, Supabase (Auth, Postgres com RLS, Storage), zod, vitest. Deploy na Vercel, região `gru1`, a partir do `main`.

## Mapa do código

- `src/app/(app)/`: telas logadas. `/` convites, `/novo` catálogo, `/convites/[id]` gestão, `/admin/*` só para admin.
- `src/app/c/[slug]`: convite público. `src/app/previa/*`: prévias de modelo e convite, que nunca registram presença.
- `src/app/actions.ts` e `src/app/admin-actions.ts`: server actions. Toda escrita no banco passa por elas.
- `src/lib/render.ts`: monta o convite a partir do HTML do modelo, valida modelos (`templateProblems`) e define o CSP.
- `src/proxy.ts`: renova a sessão e protege as rotas (no Next 16, `proxy.ts` substitui o `middleware.ts`).
- `supabase/migrations/`: esquema e RLS. `templates/`: fontes dos modelos (arte e HTML).
- `docs/documentacao/`: requisitos e regras de negócio. Leia antes de mudar o fluxo.

## Regras que não podem quebrar

- **Permissão mora no banco.** A RLS é a fonte da verdade; as telas só escondem. Ao criar tabela ou política, siga a skill `supabase-postgres-best-practices`. Leituras liberadas pela RLS ainda podem precisar de filtro na tela, como `owner_id` em `/convites/[id]`.
- **Migrações são imutáveis.** Nunca edite uma migração aplicada; crie outra com data nova no nome.
- **O HTML do modelo roda em sandbox.** Sem `<script>` nem `<form>`; só o script injetado pelo servidor executa, com nonce. Escape tudo que vem do usuário (`escapeHtml`).
- **Cada convite guarda uma cópia do HTML do modelo.** Mudar um modelo não altera convites existentes.
- **Modelos e clientes vivem no banco, não no código.** Um deploy não cria nem publica modelo; isso é feito em `/admin/modelos`.

## Convenções

- Todo texto de interface é em português do Brasil, frase curta, voz ativa, sem jargão técnico.
- Estilos em tokens do `src/app/globals.css` (`--color-*`, `.button-primary`, `.panel`, `.field`). Não use cores soltas.
- Ícones de `src/components/icons.tsx`. Ações destrutivas usam `ConfirmButton`.
- Imagens do Storage passam por `next/image` com `sizes`.
- Testes ficam ao lado do código (`*.test.ts`) e cobrem `src/lib`.

## Fluxo de trabalho

- Crie um branch, faça commits pequenos e abra PR para o `main`. O CI roda `check` e `build`.
- Mudança visual: confira no navegador em 390 px e 1280 px, nos temas claro e escuro.
- Revisão de interface: skill `web-design-guidelines`. Telas novas: skill `frontend-design`.
- Novo modelo de convite: skill `criar-modelo`.
