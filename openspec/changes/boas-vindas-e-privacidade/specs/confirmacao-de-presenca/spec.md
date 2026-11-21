## ADDED Requirements

### Requirement: Aviso ao convidado sobre o uso dos dados
O sistema SHALL informar, na janela de confirmação de presença, que o nome e o número de pessoas informados vão para quem enviou o convite, com link para a Política de Privacidade.

#### Scenario: Convidado abre a confirmação
- **WHEN** o convidado abre a janela de confirmar presença
- **THEN** vê o aviso de que o nome e o número de pessoas vão para quem enviou o convite e um link para a Política de Privacidade, que abre em outra aba
