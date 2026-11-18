# Proposal

## Why

O Niver precisa de receita, e o valor está no convite publicado: o link que funciona, recebe confirmações e abre o mapa. Hoje o cliente publica de graça e o link fica no ar para sempre. Cobrar por Pix na publicação, com validade definida, transforma o convite em produto pago sem atrapalhar a criação e a prévia.

## What Changes

- Criar e ver a prévia do convite continuam gratuitos.
- **BREAKING** O cliente deixa de publicar sozinho: publicar passa a exigir um pagamento Pix confirmado pelo Mercado Pago. Só o servidor muda a situação do convite.
- A prévia antes do pagamento mostra a marca "PRÉVIA" e não aceita confirmação de presença, para que um print não substitua o convite pago.
- O convite pago fica ativo até a data de expiração, mostrada na compra e na gestão, e pode ser compartilhado sem limite nesse período.
- Depois da expiração, o convite é arquivado: o link mostra uma página de convite encerrado, e o dono continua vendo o convite e as presenças, só para leitura, como histórico.

## Capabilities

### New Capabilities
- `cobranca`: cobrança do convite por Pix, confirmação do pagamento, período de validade e arquivamento.

### Modified Capabilities
- `convites`: publicar passa a depender de pagamento confirmado; a prévia ganha marca d'água; surge o estado arquivado, com histórico só para leitura.

## Impact

- **Banco:** nova tabela de pagamentos; colunas de validade e arquivamento em `invitations`; o cliente perde a permissão de alterar `status`.
- **Código:** server action para gerar a cobrança, rota de webhook do Mercado Pago, `/c/[slug]` e `/api/rsvp` checam validade, telas de pagamento e de histórico.
- **Serviço externo:** Mercado Pago (API de pagamentos e webhooks), com credenciais guardadas como variáveis de ambiente na Vercel.
- **Convites já publicados:** precisam de uma regra de transição (ver design).
