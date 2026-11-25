## ADDED Requirements

### Requirement: Qualquer conta confirmada cria convites
O sistema SHALL permitir a qualquer pessoa com conta confirmada criar convites, sem autorização prévia do admin. Publicar continua exigindo pagamento ou cortesia (capacidade `cobranca`).

#### Scenario: Conta nova abre o catálogo
- **WHEN** uma pessoa com conta recém-confirmada abre `/novo`
- **THEN** vê os modelos liberados para todos, sem aviso de conta não autorizada

#### Scenario: Visitante sem conta tenta criar convite pela API
- **WHEN** alguém sem sessão tenta inserir um convite direto no banco
- **THEN** a inserção é recusada

## REMOVED Requirements

### Requirement: Só clientes autorizados criam convites
**Reason**: O cadastro passa a ser aberto; o controle do que vai ao ar é o pagamento.
**Migration**: A política de inserção em `invitations` e o `/novo` deixam de consultar `allowed_emails`. A tabela fica sem uso até a limpeza depois do lançamento.

### Requirement: Admin gerencia clientes
**Reason**: Sem a lista de autorizados, não há clientes a gerenciar. Modelos restritos continuam liberados por e-mail na tela do modelo.
**Migration**: A tela "Clientes" sai do menu do admin; a rota e as ações saem na limpeza depois do lançamento.
