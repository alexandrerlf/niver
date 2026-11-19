## ADDED Requirements

### Requirement: Apresentação para visitantes
O sistema SHALL mostrar a página de apresentação a quem abre o endereço principal sem estar logado, com um convite para começar que leva ao login, e SHALL mostrar os convites do usuário a quem está logado.

#### Scenario: Visitante abre o endereço principal
- **WHEN** uma pessoa sem sessão abre `/`
- **THEN** vê a página de apresentação do Niver, sem ser levada para `/login`

#### Scenario: Visitante toca em começar
- **WHEN** o visitante toca em "Criar meu convite" na apresentação
- **THEN** é levado para `/login`

#### Scenario: Usuário logado abre o endereço principal
- **WHEN** uma pessoa logada abre `/`
- **THEN** vê a lista dos seus convites

#### Scenario: Visitante abre outra tela interna
- **WHEN** uma pessoa sem sessão abre `/novo`
- **THEN** continua sendo levada para `/login`
