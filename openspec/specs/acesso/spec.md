# acesso

## Purpose

Quem pode entrar no Niver e o que cada perfil pode fazer: admin, cliente autorizado e convidado sem login. A permissão é aplicada no banco, não só nas telas.

## Requirements

### Requirement: Login por Google ou e-mail
O sistema SHALL permitir entrar com conta Google ou com e-mail e senha confirmados.

#### Scenario: E-mail ainda não confirmado
- GIVEN uma conta criada com e-mail e senha
- WHEN a pessoa tenta entrar antes de confirmar o e-mail
- THEN o login é recusado com a mensagem de e-mail ou senha incorretos, ou e-mail não confirmado

#### Scenario: Visitante sem login abre uma tela interna
- GIVEN uma pessoa sem sessão
- WHEN ela abre `/novo`
- THEN é levada para `/login`

### Requirement: Admin definido no banco
O sistema SHALL tratar como admin apenas os e-mails cadastrados na lista de admins do banco, e SHALL esconder as telas de admin dos demais.

#### Scenario: Cliente abre tela de admin
- GIVEN um cliente que não é admin
- WHEN ele abre `/admin/modelos`
- THEN é levado para `/`

#### Scenario: Cliente tenta se autorizar
- GIVEN um cliente logado
- WHEN ele tenta incluir o próprio e-mail na lista de autorizados
- THEN a operação é recusada pelo banco

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

### Requirement: Qualquer conta confirmada cria convites
O sistema SHALL permitir a qualquer pessoa com conta confirmada criar convites, sem autorização prévia do admin. Publicar continua exigindo pagamento ou cortesia (capacidade `cobranca`).

#### Scenario: Conta nova abre o catálogo
- **WHEN** uma pessoa com conta recém-confirmada abre `/novo`
- **THEN** vê os modelos liberados para todos, sem aviso de conta não autorizada

#### Scenario: Visitante sem conta tenta criar convite pela API
- **WHEN** alguém sem sessão tenta inserir um convite direto no banco
- **THEN** a inserção é recusada
