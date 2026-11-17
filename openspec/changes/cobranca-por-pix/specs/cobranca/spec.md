## Purpose

Cobrança do convite por Pix via Mercado Pago: gerar a cobrança, confirmar o pagamento, controlar o período em que o convite fica no ar e arquivá-lo ao fim desse período.

## ADDED Requirements

### Requirement: Cobrança Pix para publicar
O sistema SHALL gerar uma cobrança Pix, com QR code e código copia e cola, quando o dono pedir para publicar um convite em rascunho com os dados obrigatórios preenchidos.

#### Scenario: Pedido de publicação
- **WHEN** o dono de um convite completo em rascunho toca em Publicar
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

### Requirement: Período de validade
O sistema SHALL manter o convite pago ativo até a data de expiração definida no pagamento, e SHALL mostrar essa data ao dono na compra e na gestão do convite, com a informação de que o link pode ser compartilhado quantas vezes quiser.

#### Scenario: Dono consulta a validade
- **WHEN** o dono abre a gestão de um convite pago
- **THEN** vê "Ativo até dd/mm. Compartilhe o link quantas vezes quiser."

### Requirement: Arquivamento ao expirar
O sistema SHALL arquivar o convite depois da data de expiração. Um convite arquivado MUST NOT aceitar confirmações nem mostrar o convite no link público.

#### Scenario: Convidado abre link expirado
- **WHEN** um convidado abre o link de um convite arquivado
- **THEN** vê uma página informando que o convite foi encerrado, sem os dados da festa

#### Scenario: Confirmação depois de arquivado
- **WHEN** alguém envia uma confirmação para um convite arquivado
- **THEN** a confirmação é recusada

### Requirement: Histórico na conta
O sistema SHALL manter o convite arquivado na conta do dono, com a prévia e a lista de presenças visíveis apenas para leitura.

#### Scenario: Dono revisita um convite antigo
- **WHEN** o dono abre um convite arquivado
- **THEN** vê a prévia e as presenças, sem os botões de editar, compartilhar e publicar
