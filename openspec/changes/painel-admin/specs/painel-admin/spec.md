## Purpose

Visão geral do negócio para o admin do Niver: contas, convites, pagamentos e faturamento, sem precisar abrir o banco ou o Mercado Pago.

## ADDED Requirements

### Requirement: Visão geral só para o admin
O sistema SHALL mostrar em `/admin` a visão geral do negócio apenas para quem está na lista de admins do banco, e MUST recusar os dados a qualquer outra conta, inclusive por acesso direto à API.

#### Scenario: Admin abre a visão geral
- **WHEN** o admin abre `/admin`
- **THEN** vê os números do negócio e os últimos pagamentos

#### Scenario: Cliente abre a visão geral
- **WHEN** uma conta que não é admin abre `/admin`
- **THEN** é levada para `/convites`

#### Scenario: Cliente pede os dados direto ao banco
- **WHEN** uma conta que não é admin chama a função da visão geral pela API
- **THEN** a chamada é recusada e nenhum número é devolvido

### Requirement: Números do negócio
O sistema SHALL mostrar contas cadastradas e novas nos últimos 30 dias, convites criados, convites no ar, Pix pagos no mês atual, faturamento do mês atual e total, e quantidade de cortesias. O mês segue o horário de Brasília.

#### Scenario: Pix pago no mês
- **WHEN** um Pix de R$ 5,00 é pago neste mês
- **THEN** o faturamento do mês e o total aumentam R$ 5,00 e os Pix pagos no mês aumentam 1

#### Scenario: Cortesia não conta como faturamento
- **WHEN** o admin publica um convite sem cobrar
- **THEN** as cortesias aumentam 1 e o faturamento não muda

### Requirement: Últimos pagamentos
O sistema SHALL listar os 10 pagamentos mais recentes, com data, valor, origem (Pix ou cortesia) e o nome do convite, com link para a gestão do convite quando ele ainda existir.

#### Scenario: Nenhum pagamento ainda
- **WHEN** ainda não houve nenhum pagamento
- **THEN** a lista mostra "Nenhum pagamento ainda."
