# Design

## Context

Hoje o cliente publica o convite mudando `status` direto (a permissão de `update` em `invitations` inclui `status`), e o link `/c/<slug>` vale para sempre. A cobrança precisa tirar essa decisão do cliente e colocá-la no servidor, depois da confirmação do Mercado Pago. Motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Pagamento confirmado no servidor, nunca pela palavra do navegador.
- O banco recusa publicação, edição e confirmação fora das regras, mesmo por acesso direto à API.

**Non-Goals:**
- Cartão de crédito, cupons, reembolso pelo app e nota fiscal.
- Impedir captura de tela: nenhum site consegue. A proteção é a prévia marcada e sem função.

## Decisions

- **Pix pelo Mercado Pago, API de pagamentos.** Cria a cobrança com `payment_method_id = pix` e recebe o QR code e o copia e cola na resposta. Alternativa: link de checkout do Mercado Pago; descartada porque tira o cliente do app e esconde o QR code.
- **Webhook com confirmação ativa.** A rota de webhook não confia no corpo do aviso: busca o pagamento na API do Mercado Pago com o token do app e só publica se o status for `approved` e o valor e a referência baterem com a cobrança gravada. Também valida a assinatura `x-signature`. A referência externa do pagamento é o id da cobrança no banco.
- **Publicação por função do banco.** A publicação e a expiração são feitas por uma função `security definer` chamada só pelo servidor com a chave de serviço. O cliente perde o `grant update (status)`. Alternativa: checar na server action; descartada porque a regra do projeto é permissão no banco.
- **Idempotência.** A tabela de pagamentos guarda o id do pagamento do Mercado Pago com `unique`; um aviso repetido não publica de novo nem muda a validade.
- **Expiração sem tarefa agendada.** O link e a confirmação comparam a data de expiração com a data atual a cada acesso, então o convite deixa de funcionar na hora certa mesmo sem processo em segundo plano. Um `pg_cron` diário só atualiza o `status` para `archived`, para as listas da conta.
- **Marca "PRÉVIA" no servidor.** A prévia injeta a marca e já não registra presença (`rsvpUrl: null`). A marca entra pelo mesmo mecanismo que injeta as janelas do sistema, então vale para todos os modelos sem mudar o HTML deles.

## Risks / Trade-offs

- [Webhook atrasado ou perdido] → a tela de pagamento também consulta a situação da cobrança a cada poucos segundos e, ao voltar ao app, o servidor confere o pagamento pendente no Mercado Pago.
- [Credenciais vazadas] → ficam só em variáveis de ambiente da Vercel, nunca no código nem no navegador.
- [Convites já publicados antes da cobrança] → recebem uma validade de transição (decisão 6 abaixo), para não caírem de surpresa.
- [Mudança de preço com cobrança aberta] → a cobrança grava o valor no momento em que foi gerada.

## Migration Plan

1. Migração: tabela de pagamentos, colunas `paid_at`, `expires_at` e `archived` em `status`, função de publicação, revogação do `update (status)` do cliente, política de confirmação que exige convite ativo.
2. Preencher `expires_at` dos convites já publicados com a regra de transição.
3. Deploy com as credenciais do Mercado Pago em ambiente de teste, cobrança de ponta a ponta no sandbox.
4. Trocar para as credenciais de produção.
Rollback: devolver o `grant update (status)` e remover a checagem de validade em `/c/[slug]`.

## Open Questions

Estas decisões mudam as especificações ou as tarefas e precisam ser respondidas pelo dono antes de escrever `tasks.md`:

1. **Preço** por convite.
2. **Validade.** Um mês contado do pagamento, ou ativo até alguns dias depois da festa? Sugestão: o que for mais tarde entre 30 dias do pagamento e 7 dias depois da festa, para o convite nunca cair antes da festa.
3. **Cadastro.** Continua só para e-mails liberados pelo admin, ou qualquer pessoa pode se cadastrar e pagar?
4. **Cortesia.** O admin pode publicar sem pagar, para testes e presentes?
5. **Reativação.** Convite arquivado pode voltar ao ar com um novo pagamento?
6. **Convites já publicados.** Que validade recebem na transição? Sugestão: 30 dias a partir da migração, ou 7 dias depois da festa, o que for mais tarde.
7. **Conta do Mercado Pago** com Pix habilitado e credenciais de teste.
