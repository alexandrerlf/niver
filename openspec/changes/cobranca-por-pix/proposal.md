# Proposal

## Why

O Niver precisa de receita, e o valor está no convite publicado: o link que funciona, recebe confirmações e abre o mapa. Hoje o cliente publica de graça, o link fica no ar para sempre e só e-mails liberados pelo admin criam convites. Cobrar R$ 5 por Pix na publicação, com validade definida, transforma o convite em produto pago e permite abrir o cadastro para qualquer pessoa sem atrapalhar a criação e a prévia.

## What Changes

- Criar e ver a prévia do convite continuam gratuitos.
- **BREAKING** Qualquer conta confirmada cria convites: a lista de e-mails autorizados deixa de ser exigida e a tela "Clientes" do admin sai do menu. Modelos restritos continuam liberados por e-mail.
- **BREAKING** O cliente deixa de publicar sozinho: publicar exige um pagamento Pix de R$ 5,00, confirmado pelo Mercado Pago. Só o servidor muda a situação do convite.
- A prévia antes do pagamento leva a marca "PRÉVIA" repetida sobre todo o convite e fica com confirmação, mapa e presentes desativados, para que um print não substitua o convite pago.
- O convite pago fica ativo até 7 dias depois da festa (ou do pagamento, se for depois da festa). Se o dono mudar a data da festa, a validade acompanha, até 90 dias depois do pagamento. A data aparece na compra e na gestão, e o link pode ser compartilhado sem limite nesse período.
- O admin publica qualquer convite sem pagar (cortesia), com a mesma regra de validade.
- Depois da expiração, o convite é arquivado: o link mostra uma página de convite encerrado, e o dono continua vendo o convite e as presenças, só para leitura. Um novo pagamento de R$ 5,00 o coloca de volta no ar.
- Convites publicados antes da cobrança recebem validade de 7 dias depois da festa, com pelo menos 7 dias a partir da entrada da cobrança.

## Capabilities

### New Capabilities
- `cobranca`: preço, cobrança do convite por Pix, confirmação do pagamento, cortesia do admin, período de validade, arquivamento e reativação.

### Modified Capabilities
- `convites`: publicar passa a depender de pagamento confirmado; a prévia ganha marca d'água e fica sem função; surge o estado arquivado, com histórico só para leitura e sem edição.
- `acesso`: qualquer conta confirmada cria convites; a gestão de clientes autorizados pelo admin deixa de existir.

## Impact

- **Banco:** nova tabela de cobranças; colunas `paid_at` e `expires_at` e o estado `archived` em `invitations`; o cliente perde a permissão de alterar `status`; a política de criação de convites deixa de consultar `allowed_emails`; validade recalculada quando a data da festa muda.
- **Código:** server action para gerar a cobrança, rota de webhook do Mercado Pago, publicação de cortesia no admin, `/c/[slug]` e `/api/rsvp` checam validade, marca "PRÉVIA" no `render.ts`, telas de pagamento, de reativação e de histórico; `/novo` deixa de checar autorização; tela "Clientes" removida do menu.
- **Serviço externo:** Mercado Pago (API de pagamentos e webhooks), com credenciais em variáveis de ambiente da Vercel.
- **Lançamento:** o cadastro aberto e a cobrança entram juntos, no mesmo deploy, para ninguém publicar de graça no intervalo.
