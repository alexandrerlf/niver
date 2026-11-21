# convites

## Purpose

O convite que o cliente cria a partir de um modelo, publica e compartilha por link, e a página pública que os convidados abrem.

## Requirements

### Requirement: Criar convite a partir de modelo liberado
O sistema SHALL permitir ao cliente criar um convite só a partir de um modelo publicado e liberado para ele, informando nome, data, horário e local, e opcionalmente idade, link do mapa, mensagem, sugestões de presentes e prazo de confirmação.

#### Scenario: Campos obrigatórios em branco
- GIVEN o formulário de dados da festa
- WHEN o cliente envia sem o local
- THEN o convite não é criado e aparece "Informe o local."

### Requirement: Cópia do HTML do modelo
O sistema SHALL guardar no convite uma cópia do HTML do modelo no momento da criação.

#### Scenario: Admin edita o modelo depois
- GIVEN um convite publicado com o modelo Bluey
- WHEN o admin altera o HTML do Bluey
- THEN o convite publicado continua com o HTML antigo

### Requirement: Rascunho, prévia e publicação
O sistema SHALL criar o convite como rascunho com prévia, e SHALL gerar o link `/c/<slug>` só depois de publicado.

#### Scenario: Link de rascunho
- GIVEN um convite em rascunho
- WHEN alguém abre o `/c/<slug>` dele
- THEN vê "Convite não encontrado."

### Requirement: Edição depois de publicar
O sistema SHALL permitir editar os dados de um convite publicado sem nova arte, com efeito imediato no link.

#### Scenario: Corrigir o horário
- GIVEN um convite publicado às 15h
- WHEN o cliente muda para 16h e salva
- THEN quem abre o link vê 16h

### Requirement: Gestão só pelo dono
O sistema SHALL mostrar a tela de gestão de um convite (dados, compartilhamento e presenças) apenas ao dono.

#### Scenario: Outra conta abre a gestão
- GIVEN um convite publicado de outra pessoa
- WHEN um cliente abre `/convites/<id>` desse convite
- THEN vê "Não encontramos esta página"

### Requirement: Compartilhar
O sistema SHALL oferecer copiar o link, enviar pelo WhatsApp com mensagem pronta e abrir o convite.

#### Scenario: Copiar link
- GIVEN um convite publicado
- WHEN o cliente toca em Copiar
- THEN o link vai para a área de transferência e o botão mostra "Copiado"

### Requirement: Excluir convite
O sistema SHALL excluir um convite só depois de confirmação, desativando o link e apagando as presenças, sem apagar a arte do modelo.

#### Scenario: Exclusão confirmada
- GIVEN um convite publicado com presenças
- WHEN o dono confirma a exclusão
- THEN o link deixa de abrir e as presenças são apagadas

### Requirement: Convite público seguro
O sistema SHALL servir o convite público sem login, em sandbox, sem acesso aos cookies do app e executando apenas o script injetado pelo servidor.

#### Scenario: Nome com código
- GIVEN um convite cujo nome é `<script>alert(1)</script>`
- WHEN o convidado abre o link
- THEN o nome aparece como texto e nenhum script do nome executa

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
