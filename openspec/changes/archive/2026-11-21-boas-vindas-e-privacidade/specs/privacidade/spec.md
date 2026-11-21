## Purpose

Como o Niver cumpre a LGPD: transparência sobre o tratamento de dados, aceite dos termos, direitos do titular de baixar e apagar os próprios dados e prazo de guarda das presenças.

## ADDED Requirements

### Requirement: Política de Privacidade e Termos de Uso públicos
O sistema SHALL publicar, sem exigir login, uma Política de Privacidade e Termos de Uso em português que identifiquem o controlador e o canal de contato para privacidade, e SHALL oferecer links para os dois na vitrine, no login e nas telas do app.

#### Scenario: Visitante abre a política
- **WHEN** uma pessoa sem sessão abre `/privacidade`
- **THEN** vê a Política de Privacidade com o controlador, o e-mail de contato, os dados tratados, as finalidades, os direitos do titular e o prazo de guarda

#### Scenario: Visitante abre os termos
- **WHEN** uma pessoa sem sessão abre `/termos`
- **THEN** vê os Termos de Uso com o foro de Manaus/AM

#### Scenario: Link no app
- **WHEN** um cliente logado abre "Minha conta"
- **THEN** encontra links para a Política de Privacidade e os Termos de Uso

### Requirement: Aviso de aceite no login
O sistema SHALL informar, junto aos botões de entrar e de criar conta, que continuar significa concordar com os Termos de Uso e a Política de Privacidade, com links para os dois.

#### Scenario: Criar conta
- **WHEN** uma pessoa abre `/login`
- **THEN** vê, antes de enviar, o aviso de que ao continuar concorda com os Termos de Uso e a Política de Privacidade

### Requirement: Baixar meus dados
O sistema SHALL permitir ao cliente logado baixar, em arquivo JSON, os dados da conta, todos os convites dele e as presenças recebidas.

#### Scenario: Cliente baixa os dados
- **WHEN** o cliente toca em "Baixar meus dados" em "Minha conta"
- **THEN** recebe um arquivo com o e-mail da conta, a data de criação, cada convite com seus dados e as presenças de cada convite

#### Scenario: Pedido sem sessão
- **WHEN** alguém sem sessão pede o arquivo de dados
- **THEN** o pedido é recusado

### Requirement: Excluir minha conta
O sistema SHALL permitir ao cliente excluir a própria conta depois de confirmar, apagando a conta, os convites, as presenças e o e-mail dele das listas de clientes autorizados e de liberação de modelos.

#### Scenario: Exclusão confirmada
- **WHEN** o cliente confirma "Excluir minha conta"
- **THEN** a conta, os convites e as presenças são apagados, o e-mail sai das listas de liberação, a sessão é encerrada e os links dos convites dele deixam de abrir

#### Scenario: Exclusão cancelada
- **WHEN** o cliente fecha a confirmação sem excluir
- **THEN** nada é apagado

#### Scenario: Excluir a conta de outra pessoa
- **WHEN** um cliente tenta, direto no banco, excluir a conta de outra pessoa
- **THEN** a operação não afeta nenhuma conta além da dele

### Requirement: Prazo de guarda das presenças
O sistema SHALL apagar as presenças de um convite 6 meses depois da data da festa, mantendo o convite no histórico do dono.

#### Scenario: Festa há mais de 6 meses
- **WHEN** a rotina diária roda e um convite teve a festa há mais de 6 meses
- **THEN** as presenças desse convite são apagadas e o convite continua na conta do dono

#### Scenario: Festa recente
- **WHEN** a rotina diária roda e a festa de um convite foi há 2 meses
- **THEN** as presenças desse convite continuam guardadas
