# cobranca Specification

## Purpose
Cobrança do convite por Pix via Mercado Pago: preço, gerar a cobrança, confirmar o pagamento, cortesia do admin, controlar o período em que o convite fica no ar, arquivá-lo ao fim desse período e reativá-lo.

## Requirements

### Requirement: Preço da publicação
O sistema SHALL cobrar R$ 5,00 para publicar um convite e o mesmo valor para reativá-lo, e SHALL mostrar o valor antes de gerar a cobrança.

#### Scenario: Dono vê o preço
- **WHEN** o dono de um convite completo em rascunho abre a etapa de publicar
- **THEN** vê "R$ 5,00" e até quando o convite ficará ativo, antes de gerar o Pix

#### Scenario: Preço muda com cobrança em aberto
- **WHEN** o preço muda enquanto uma cobrança gerada a R$ 5,00 ainda está em aberto
- **THEN** essa cobrança continua valendo R$ 5,00

### Requirement: Cobrança Pix para publicar
O sistema SHALL gerar uma cobrança Pix, com QR code e código copia e cola, quando o dono pedir para publicar um convite em rascunho com os dados obrigatórios preenchidos.

#### Scenario: Pedido de publicação
- **WHEN** o dono de um convite completo em rascunho toca em "Gerar Pix"
- **THEN** vê o valor, o QR code, o código copia e cola e a data até a qual o convite ficará ativo

#### Scenario: Dados incompletos
- **WHEN** o dono pede para publicar um convite sem o local
- **THEN** nenhuma cobrança é gerada e aparece "Preencha nome, data, horário e local antes de publicar."

#### Scenario: Pedir de novo com cobrança em aberto
- **WHEN** o dono pede para publicar enquanto uma cobrança desse convite ainda está em aberto
- **THEN** o sistema mostra a mesma cobrança em vez de criar outra

### Requirement: Publicação só com pagamento confirmado
O sistema SHALL publicar o convite somente depois de confirmar com o Mercado Pago que o pagamento foi aprovado, e MUST ignorar avisos de pagamento que não puder confirmar.

#### Scenario: Pagamento aprovado
- **WHEN** o Mercado Pago informa a aprovação do pagamento de um convite
- **THEN** o convite passa a publicado, o link começa a funcionar e a tela de pagamento do dono mostra que deu certo

#### Scenario: Aviso falso de pagamento
- **WHEN** chega ao app um aviso de pagamento aprovado que o Mercado Pago não confirma
- **THEN** o convite continua em rascunho

#### Scenario: Aviso repetido
- **WHEN** o mesmo pagamento aprovado é avisado duas vezes
- **THEN** o convite é publicado uma vez só e a data de expiração não muda

#### Scenario: Cobrança vencida sem pagamento
- **WHEN** a cobrança Pix vence sem pagamento
- **THEN** o convite continua em rascunho e o dono pode gerar uma nova cobrança

#### Scenario: Cliente tenta publicar direto
- **WHEN** um cliente tenta mudar a situação do próprio convite para publicado sem pagar, direto no banco
- **THEN** a alteração é recusada

### Requirement: Cortesia do admin
O sistema SHALL permitir ao admin publicar ou reativar qualquer convite sem pagamento, registrando a publicação como cortesia, com a mesma regra de validade.

#### Scenario: Admin publica de cortesia
- **WHEN** o admin toca em "Publicar sem cobrar" num convite completo em rascunho
- **THEN** o convite passa a publicado, com validade até 7 dias depois da festa, e fica registrado como cortesia

#### Scenario: Cliente tenta cortesia
- **WHEN** um cliente que não é admin tenta publicar de cortesia
- **THEN** a publicação é recusada

### Requirement: Período de validade
O sistema SHALL manter o convite publicado ativo até o fim do dia, no horário de Brasília, de 7 dias depois da data da festa, ou de 7 dias depois do pagamento se ele for posterior à festa. Se o dono mudar a data da festa, a validade SHALL acompanhar a nova data, limitada a 90 dias depois do pagamento. O sistema SHALL mostrar a validade ao dono na compra e na gestão do convite, com a informação de que o link pode ser compartilhado quantas vezes quiser.

#### Scenario: Festa no futuro
- **WHEN** o dono paga em 1º de dezembro por uma festa em 20 de dezembro
- **THEN** o convite fica ativo até o fim de 27 de dezembro

#### Scenario: Dono consulta a validade
- **WHEN** o dono abre a gestão de um convite pago
- **THEN** vê "Ativo até dd/mm. Compartilhe o link quantas vezes quiser."

#### Scenario: Festa adiada
- **WHEN** o dono de um convite pago em 1º de dezembro muda a festa de 20 para 27 de dezembro
- **THEN** a validade passa para o fim de 3 de janeiro

#### Scenario: Festa adiada além do limite
- **WHEN** o dono de um convite pago em 1º de dezembro muda a festa para 30 de abril
- **THEN** a validade fica no fim de 1º de março, 90 dias depois do pagamento

#### Scenario: Convite publicado antes da cobrança
- **WHEN** a cobrança entra no ar e um convite já publicado tem festa daqui a 2 dias
- **THEN** ele fica ativo até o fim de 7 dias a partir da entrada da cobrança, sem pagamento

### Requirement: Arquivamento ao expirar
O sistema SHALL arquivar o convite depois da data de expiração. Um convite arquivado MUST NOT aceitar confirmações nem mostrar o convite no link público.

#### Scenario: Convidado abre link expirado
- **WHEN** um convidado abre o link de um convite arquivado
- **THEN** vê uma página informando que o convite foi encerrado, sem os dados da festa

#### Scenario: Confirmação depois de arquivado
- **WHEN** alguém envia uma confirmação para um convite arquivado
- **THEN** a confirmação é recusada

### Requirement: Reativação com novo pagamento
O sistema SHALL permitir ao dono colocar um convite arquivado de volta no ar com um novo pagamento de R$ 5,00, mantendo o mesmo link.

#### Scenario: Dono reativa
- **WHEN** o dono paga a reativação de um convite arquivado
- **THEN** o convite volta a publicado, o link antigo volta a funcionar e a validade é recalculada a partir do novo pagamento

### Requirement: Histórico na conta
O sistema SHALL manter o convite arquivado na conta do dono, com a prévia e a lista de presenças visíveis apenas para leitura, e a opção de reativar.

#### Scenario: Dono revisita um convite antigo
- **WHEN** o dono abre um convite arquivado
- **THEN** vê a prévia com a marca "ENCERRADO", as presenças e o botão "Reativar por R$ 5,00", sem os botões de editar e compartilhar
