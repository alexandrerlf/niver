## ADDED Requirements

### Requirement: Consentimento do responsável pela criança
O sistema SHALL exigir, para criar um convite, que a pessoa confirme ser mãe, pai ou responsável pela criança e autorize o uso do nome e da idade dela no convite, e SHALL guardar no convite a data dessa confirmação.

#### Scenario: Criar convite sem confirmar
- **WHEN** o cliente envia os dados da festa sem marcar a confirmação do responsável
- **THEN** o convite não é criado e aparece "Confirme que você é responsável pela criança para continuar."

#### Scenario: Criar convite com a confirmação
- **WHEN** o cliente marca a confirmação do responsável e envia os dados da festa
- **THEN** o convite é criado e guarda a data da confirmação

### Requirement: Convite público fora dos buscadores
O sistema SHALL marcar o convite público e as prévias para que buscadores não os indexem nem sigam os links deles.

#### Scenario: Buscador acessa o convite
- **WHEN** um robô de busca abre `/c/<slug>`
- **THEN** a resposta pede que a página não seja indexada nem os links seguidos

### Requirement: Link difícil de adivinhar
O sistema SHALL gerar, para cada convite novo, um código aleatório no link com pelo menos 64 bits de entropia, além do nome e da idade.

#### Scenario: Novo convite
- **WHEN** o cliente cria um convite para Helena, 6 anos
- **THEN** o link fica no formato `/c/helena-6-anos-<código>`, com um código aleatório de pelo menos 16 caracteres hexadecimais

#### Scenario: Convite antigo
- **WHEN** alguém abre o link de um convite criado antes desta mudança
- **THEN** o convite continua abrindo pelo link antigo
