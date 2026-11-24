# Design

## Context

Hoje o cliente publica o convite mudando `status` direto (a permissão de `update` em `invitations` inclui `status`), o link `/c/<slug>` vale para sempre e só e-mails em `allowed_emails` criam convites (`can_create_invitations` e a política de inserção). A cobrança precisa tirar a publicação do cliente e colocá-la no servidor, depois da confirmação do Mercado Pago, e com isso o cadastro pode ser aberto. Motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Pagamento confirmado no servidor, nunca pela palavra do navegador.
- O banco recusa publicação, edição e confirmação fora das regras, mesmo por acesso direto à API.
- Uma prévia que não sirva como convite.

**Non-Goals:**
- Cartão de crédito, cupons, reembolso pelo app e nota fiscal.
- Impedir captura de tela: nenhum site consegue. A proteção é a prévia marcada e sem função.
- Apagar a tabela `allowed_emails` e a tela "Clientes": ficam para uma limpeza depois do lançamento.

## Decisions

- **Preço de R$ 5,00 por publicação.** Fica numa constante do servidor (`src/lib/pricing.ts`, em centavos) e é gravado na cobrança no momento em que ela é gerada. Mudar o preço não altera cobranças em aberto. Reativar custa o mesmo.
- **Pix pelo Mercado Pago, API de Orders.** O servidor cria a cobrança com `POST /v1/orders` (`type: online`, `processing_mode: automatic`, um pagamento com `payment_method.id = pix`, `external_reference` = id da cobrança no banco, cabeçalho `X-Idempotency-Key`) e recebe na resposta o QR code e o copia e cola, que a tela mostra. Alternativas: a API de Payments, que o painel do Mercado Pago marca como descontinuada em breve; e o Checkout Pro, descartado porque tira o cliente do app e esconde o QR code.
- **Aviso com confirmação ativa.** A rota de webhook valida a assinatura `x-signature` com a assinatura secreta do painel e não confia no corpo do aviso: busca a order com `GET /v1/orders/{id}` usando o token do app e só publica se ela estiver paga, com o valor e a `external_reference` iguais aos da cobrança gravada.
- **Teste sem dinheiro de verdade.** Com as credenciais de teste, uma order com pagador de nome "APRO" é aprovada automaticamente em poucos segundos; não é preciso conta compradora de teste. O comportamento será confirmado na primeira cobrança de teste.
- **Publicação por função do banco.** Publicar, reativar e expirar são feitos por funções `security definer` chamadas só pelo servidor com a chave de serviço. O cliente perde o `grant update (status)`. Alternativa: checar na server action; descartada porque a regra do projeto é permissão no banco.
- **Validade.** `expires_at` = fim do dia, no horário de Brasília, de `max(data da festa, data do pagamento) + 7 dias`. Quando o dono muda a data da festa de um convite pago, um gatilho recalcula com a mesma fórmula, limitada a `paid_at + 90 dias`. Isso cobre festa adiada sem permitir reusar o convite indefinidamente. Alternativa: 30 dias do pagamento; descartada porque derruba o convite antes da festa de quem paga com antecedência.
- **Cortesia do admin.** O admin publica pela mesma função, com a cobrança registrada com valor zero e origem `cortesia`, para o histórico mostrar quem publicou sem pagar. A validade segue a mesma regra.
- **Reativação.** Um convite arquivado aceita nova cobrança de R$ 5,00. Com o pagamento aprovado, volta a publicado com `paid_at` novo e validade recalculada; o slug não muda, então o link antigo volta a funcionar.
- **Idempotência.** A tabela de cobranças guarda o id do pagamento do Mercado Pago com `unique`; um aviso repetido não publica de novo nem muda a validade.
- **Expiração sem depender de tarefa agendada.** O link e a confirmação comparam `expires_at` com o momento atual a cada acesso, então o convite deixa de funcionar na hora certa. Um `pg_cron` diário só muda o `status` para `archived`, para as listas da conta.
- **Marca "PRÉVIA" no servidor.** Na prévia de um convite não pago, o servidor injeta, pelo mesmo mecanismo das janelas do sistema (`RUNTIME_MARKUP`), uma camada que cobre todo o convite com "PRÉVIA" repetido na diagonal, por cima do HTML do modelo e sem capturar toques. Confirmar presença, mapa e presentes ficam desativados e avisam "Esta é uma prévia. Publique para liberar." Como entra fora do HTML do modelo, vale para todos os modelos e o cliente não consegue removê-la pelo editor. No histórico de um convite arquivado, a mesma camada diz "ENCERRADO".
- **Cadastro aberto.** A política de inserção em `invitations` e o `/novo` deixam de exigir `allowed_emails`: basta uma conta confirmada. Modelos com visibilidade restrita continuam liberados por `template_access`. A tela "Clientes" sai do menu do admin. O login com Google continua limitado aos usuários de teste do Google Cloud Console até o app ser publicado lá; isso é configuração do Google, não do Niver.
- **Convites já publicados.** Na migração, recebem `paid_at` nulo, origem `transicao` e `expires_at` = fim do dia de `max(data da festa + 7 dias, data da migração + 7 dias)`.

## Risks / Trade-offs

- [Webhook atrasado ou perdido] → a tela de pagamento consulta a situação da cobrança a cada poucos segundos e, ao voltar ao app, o servidor confere o pagamento pendente no Mercado Pago.
- [Credenciais vazadas] → ficam só em variáveis de ambiente da Vercel, nunca no código nem no navegador.
- [Cadastro aberto atrai contas falsas] → rascunhos não custam nada além de espaço; o e-mail precisa ser confirmado para entrar; nada vai ao ar sem pagamento.
- [Cadastro aberto antes da cobrança] → os dois entram no mesmo deploy.
- [Mudança de preço com cobrança aberta] → a cobrança grava o valor no momento em que foi gerada.
- [Festa adiada várias vezes] → a validade acompanha até 90 dias depois do pagamento; depois disso, o dono reativa pagando de novo.

## Migration Plan

1. Migração: tabela de cobranças, colunas `paid_at` e `expires_at`, estado `archived` em `status`, funções de publicar, reativar e expirar, gatilho de recálculo da validade, revogação do `update (status)` do cliente, política de confirmação que exige convite ativo e política de inserção sem `allowed_emails`.
2. Preencher `expires_at` dos convites já publicados com a regra de transição.
3. Deploy com as credenciais de teste do Mercado Pago e cobrança de ponta a ponta com pagador "APRO".
4. Trocar para as credenciais de produção.

Rollback: devolver o `grant update (status)` e a exigência de `allowed_emails`, e remover a checagem de validade em `/c/[slug]`.

## Open Questions

Nenhuma decisão de produto em aberto. Pendências operacionais do dono: cadastrar o webhook no painel do Mercado Pago quando a rota existir (e salvar `MERCADOPAGO_WEBHOOK_SECRET` na Vercel), cadastrar uma chave Pix na conta real e ativar as credenciais de produção antes do lançamento.

Variáveis de ambiente na Vercel: `MERCADOPAGO_ACCESS_TOKEN` (teste, já salva), `SUPABASE_SECRET_KEY` (já salva) e `MERCADOPAGO_WEBHOOK_SECRET` (depois).
