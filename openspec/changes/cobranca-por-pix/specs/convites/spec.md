## MODIFIED Requirements

### Requirement: Rascunho, prévia e publicação
O sistema SHALL criar o convite como rascunho com prévia, e SHALL gerar o link `/c/<slug>` só depois de publicado, o que exige pagamento confirmado (capacidade `cobranca`). Antes do pagamento, a prévia SHALL mostrar a marca "PRÉVIA" e MUST NOT registrar presença.

#### Scenario: Link de rascunho
- **WHEN** alguém abre o `/c/<slug>` de um convite em rascunho
- **THEN** vê "Convite não encontrado."

#### Scenario: Prévia antes de pagar
- **WHEN** o dono abre a prévia de um convite ainda não pago
- **THEN** vê o convite com a marca "PRÉVIA" sobre ele, e tentar confirmar presença mostra que é uma prévia

### Requirement: Edição depois de publicar
O sistema SHALL permitir editar os dados de um convite publicado e ainda ativo sem nova arte e sem novo pagamento, com efeito imediato no link. Convites arquivados MUST NOT ser editados.

#### Scenario: Corrigir o horário
- **WHEN** o dono de um convite publicado às 15h muda para 16h e salva
- **THEN** quem abre o link vê 16h

#### Scenario: Editar convite arquivado
- **WHEN** o dono tenta salvar dados de um convite arquivado
- **THEN** a alteração é recusada
