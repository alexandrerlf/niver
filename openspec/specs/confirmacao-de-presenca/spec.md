# confirmacao-de-presenca

## Purpose

Como os convidados confirmam presença no convite público e como o dono acompanha as respostas.

## Requirements

### Requirement: Confirmar com nome e número de pessoas
O sistema SHALL permitir a qualquer pessoa com o link confirmar presença informando o nome e de 1 a 20 pessoas, sem login.

#### Scenario: Confirmação válida
- GIVEN um convite publicado, dentro do prazo
- WHEN o convidado informa "Vovó Ana" e 3 pessoas e confirma
- THEN aparece "Presença confirmada. Obrigado!" e a resposta entra na lista do dono

#### Scenario: Nome em branco
- GIVEN a janela de confirmação aberta
- WHEN o convidado confirma sem nome
- THEN aparece "Digite seu nome para confirmar." e nada é gravado

#### Scenario: Convite em rascunho
- GIVEN um convite ainda em rascunho
- WHEN alguém tenta registrar presença nele pela API
- THEN o registro é recusado

### Requirement: Prazo opcional para confirmar
O sistema SHALL aceitar confirmações até o fim do dia do prazo, no horário de Brasília, quando o dono definir um prazo, e o prazo MUST ser até o dia da festa.

#### Scenario: Último dia do prazo
- GIVEN um convite com prazo em 05/10
- WHEN o convidado confirma às 23h de 05/10, horário de Brasília
- THEN a confirmação é aceita

#### Scenario: Prazo encerrado
- GIVEN um convite com prazo em 05/10
- WHEN o convidado abre a janela de confirmação em 06/10
- THEN vê "As confirmações foram encerradas em 05/10" e só pode fechar a janela

#### Scenario: Envio direto depois do prazo
- GIVEN um convite com prazo vencido
- WHEN alguém envia uma confirmação direto para a API
- THEN a confirmação é recusada

#### Scenario: Prazo depois da festa
- GIVEN uma festa em 11/10
- WHEN o dono define o prazo em 12/10
- THEN os dados não são salvos e aparece "O prazo de confirmação precisa ser até o dia da festa."

### Requirement: Lista de presenças para o dono
O sistema SHALL mostrar ao dono o total de pessoas confirmadas, o número de respostas, cada resposta com nome e quantidade, e se as confirmações estão abertas ou encerradas.

#### Scenario: Sem respostas
- GIVEN um convite publicado sem confirmações
- WHEN o dono abre a gestão
- THEN vê que ninguém confirmou ainda

### Requirement: Janelas iguais em todos os modelos
O sistema SHALL usar as mesmas janelas de confirmação e de sugestões de presentes em todos os modelos, permitindo ao modelo mudar só o visual delas.

#### Scenario: Sem sugestões de presentes
- GIVEN um convite sem sugestões de presentes
- WHEN o convidado abre o link
- THEN o botão de presentes não aparece

### Requirement: Aviso ao convidado sobre o uso dos dados
O sistema SHALL informar, na janela de confirmação de presença, que o nome e o número de pessoas informados vão para quem enviou o convite, com link para a Política de Privacidade.

#### Scenario: Convidado abre a confirmação
- **WHEN** o convidado abre a janela de confirmar presença
- **THEN** vê o aviso de que o nome e o número de pessoas vão para quem enviou o convite e um link para a Política de Privacidade, que abre em outra aba
