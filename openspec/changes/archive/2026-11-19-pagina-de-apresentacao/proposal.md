# Proposal

## Why

Quem abre o Niver sem login cai direto na tela de entrar, sem saber o que o produto faz. Uma página de apresentação explica o Niver em poucos segundos e leva a pessoa a criar o primeiro convite. A identidade visual também ganha um mascote original e um ícone próprio no lugar do envelope genérico.

## What Changes

- Visitante sem login que abre `/` vê a página de apresentação em vez de ser levado ao login. Quem está logado continua vendo os seus convites em `/`.
- A página mostra o que o Niver faz, um exemplo de convite, os três passos para criar, o que o convidado consegue fazer e um convite para começar, que leva ao login.
- Mascote original (Nino, um envelope de convite festeiro), novo ícone do app a partir do rosto dele, e a marca no topo das telas passa a usar esse ícone.
- A página não mostra preço: a cobrança ainda está em definição (mudança `cobranca-por-pix`).

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `acesso`: o visitante sem login passa a ver a apresentação em `/`, e as demais telas internas continuam levando ao login.

## Impact

- `src/proxy.ts`: reescreve `/` para a apresentação quando não há sessão e libera `/apresentacao` e `/brand/`.
- Nova rota `src/app/apresentacao`, imagens em `public/brand/`, ícones em `public/icons/`.
- Service worker com cache novo, para o celular trocar o ícone antigo.
