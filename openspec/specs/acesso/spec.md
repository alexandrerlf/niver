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

### Requirement: Só clientes autorizados criam convites
O sistema SHALL permitir criar convites apenas a e-mails autorizados pelo admin, diretamente ou por liberação de um modelo restrito.

#### Scenario: Conta não autorizada
- GIVEN uma pessoa logada cujo e-mail não foi autorizado
- WHEN ela abre o catálogo
- THEN vê que a conta ainda não está autorizada e não vê modelos

#### Scenario: Tentativa direta pela API
- GIVEN uma pessoa logada não autorizada
- WHEN ela tenta inserir um convite direto no banco
- THEN a inserção é recusada

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

### Requirement: Admin gerencia clientes
O sistema SHALL permitir ao admin adicionar e remover e-mails autorizados, e SHALL pedir confirmação antes de remover.

#### Scenario: Remoção confirmada
- GIVEN um e-mail autorizado
- WHEN o admin toca em Remover e confirma
- THEN o e-mail deixa de poder criar convites, e os convites já criados continuam no ar

#### Scenario: Remoção cancelada
- GIVEN a janela de confirmação aberta
- WHEN o admin toca em Cancelar
- THEN nada muda

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
