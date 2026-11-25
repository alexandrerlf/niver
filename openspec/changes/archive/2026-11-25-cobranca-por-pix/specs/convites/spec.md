## MODIFIED Requirements

### Requirement: Rascunho, prévia e publicação
O sistema SHALL criar o convite como rascunho com prévia, e SHALL gerar o link `/c/<slug>` só depois de publicado, o que exige pagamento confirmado ou cortesia do admin (capacidade `cobranca`). Antes da publicação, a prévia SHALL mostrar a marca "PRÉVIA" repetida sobre todo o convite, injetada pelo servidor fora do HTML do modelo, e MUST NOT registrar presença, abrir o mapa nem mostrar os presentes.

#### Scenario: Link de rascunho
- **WHEN** alguém abre o `/c/<slug>` de um convite em rascunho
- **THEN** vê "Convite não encontrado."

#### Scenario: Prévia antes de pagar
- **WHEN** o dono abre a prévia de um convite ainda não pago
- **THEN** vê o convite coberto pela marca "PRÉVIA", e tocar em confirmar presença, mapa ou presentes mostra "Esta é uma prévia. Publique para liberar."

#### Scenario: Print da prévia
- **WHEN** alguém tira um print da prévia e envia aos convidados
- **THEN** a imagem mostra a marca "PRÉVIA" sobre o convite inteiro e não tem nenhum link para confirmar presença

#### Scenario: Convite publicado
- **WHEN** o convite é publicado
- **THEN** o link `/c/<slug>` mostra o convite sem a marca e com todos os botões funcionando

### Requirement: Edição depois de publicar
O sistema SHALL permitir editar os dados de um convite publicado e ainda ativo sem nova arte e sem novo pagamento, com efeito imediato no link. Convites arquivados MUST NOT ser editados.

#### Scenario: Corrigir o horário
- **WHEN** o dono de um convite publicado às 15h muda para 16h e salva
- **THEN** quem abre o link vê 16h

#### Scenario: Editar convite arquivado
- **WHEN** o dono tenta salvar dados de um convite arquivado
- **THEN** a alteração é recusada

### Requirement: Criar convite a partir de modelo liberado
O sistema SHALL permitir a qualquer conta confirmada criar um convite a partir de um modelo publicado e liberado para ela, informando nome, data, horário e local, e opcionalmente idade, link do mapa, mensagem, sugestões de presentes e prazo de confirmação. Um modelo é liberado para todos ou, se restrito, para os e-mails escolhidos pelo admin.

#### Scenario: Campos obrigatórios em branco
- **WHEN** o cliente envia o formulário de dados da festa sem o local
- **THEN** o convite não é criado e aparece "Informe o local."

#### Scenario: Conta nova cria convite
- **WHEN** uma pessoa cria uma conta, confirma o e-mail e abre o catálogo
- **THEN** vê os modelos liberados para todos e consegue criar um rascunho
