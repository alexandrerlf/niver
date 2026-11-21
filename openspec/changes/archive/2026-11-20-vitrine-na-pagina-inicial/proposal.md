# Proposal

## Why

A vitrine aparecia em `/` por uma reescrita interna para `/apresentacao`, e o nome "apresentação" ainda existia como rota. O dono quer que a vitrine seja simplesmente a primeira tela de quem não está logado, sem outro nome, e que ela tenha a estrutura de uma página de produto completa.

## What Changes

- `/` passa a ser a própria vitrine. Quem está logado é levado para `/convites`, que vira o endereço da lista de convites.
- As rotas `/apresentacao` e `/apresentacao/a` deixam de existir; links antigos são redirecionados para `/`.
- Entrar e criar conta levam ao login, e o login leva aos convites.
- A vitrine ganha: navegação por seções, selos de confiança, demonstração em quatro passos com telas reais do app, grade de recursos, perguntas frequentes, depoimentos de exemplo (só fora de produção) e botão fixo no rodapé do celular.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `acesso`: a vitrine é a página inicial e quem está logado vai para `/convites`.

## Impact

- `src/app/page.tsx` (vitrine), `src/app/(app)/convites/page.tsx` (lista), `src/components/landing/`, `src/proxy.ts`, `next.config.ts` (redirecionamento), links e redirecionamentos que apontavam para `/`.
- Imagens da demonstração em `public/landing/`.
