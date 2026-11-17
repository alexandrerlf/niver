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
