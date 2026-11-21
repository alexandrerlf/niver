## MODIFIED Requirements

### Requirement: Apresentação para visitantes
O sistema SHALL mostrar a vitrine do Niver em `/` a quem não está logado, com ações para entrar e criar conta que levam ao login, e SHALL levar para `/convites` quem está logado. Depoimentos de exemplo MUST NOT aparecer em produção.

#### Scenario: Visitante abre o endereço principal
- **WHEN** uma pessoa sem sessão abre `/`
- **THEN** vê a vitrine do Niver no próprio endereço `/`, sem ser levada para `/login`

#### Scenario: Visitante toca em começar
- **WHEN** o visitante toca em "Entrar", "Criar conta" ou "Criar meu convite"
- **THEN** é levado para `/login`

#### Scenario: Usuário logado abre o endereço principal
- **WHEN** uma pessoa logada abre `/`
- **THEN** é levada para `/convites` e vê a lista dos seus convites

#### Scenario: Link antigo da vitrine
- **WHEN** alguém abre `/apresentacao`
- **THEN** é levado para `/`

#### Scenario: Depoimentos de exemplo em produção
- **WHEN** a vitrine é aberta no ambiente de produção
- **THEN** a seção de depoimentos de exemplo não aparece

#### Scenario: Visitante abre outra tela interna
- **WHEN** uma pessoa sem sessão abre `/novo`
- **THEN** continua sendo levada para `/login`
