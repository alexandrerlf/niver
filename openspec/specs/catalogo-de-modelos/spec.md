# catalogo-de-modelos

## Purpose

Catálogo curado de modelos de convite. O admin cria cada modelo com uma arte sem dados do cliente e um HTML que coloca os dados por cima, e decide quem pode usá-lo.

## Requirements

### Requirement: Modelo nasce como rascunho
O sistema SHALL criar todo modelo novo como rascunho, com um HTML inicial funcional, a partir apenas do nome.

#### Scenario: Rascunho invisível para clientes
- GIVEN um modelo em rascunho
- WHEN um cliente autorizado abre o catálogo
- THEN o modelo não aparece

### Requirement: Arte do modelo
O sistema SHALL aceitar arte em JPG, PNG ou WebP de até 8 MB, enviada só pelo admin, sem dados de cliente escritos.

#### Scenario: Arquivo grande demais
- GIVEN um arquivo de 9 MB
- WHEN o admin tenta enviar como arte
- THEN o envio é recusado com o aviso do limite de 8 MB

#### Scenario: Cliente tenta enviar arte
- GIVEN um cliente sem perfil de admin
- WHEN ele tenta gravar um arquivo na pasta de arte de modelos
- THEN o banco recusa

### Requirement: Validação antes de publicar
O sistema SHALL impedir a publicação de um modelo sem arte, sem os campos obrigatórios (`{{art_url}}`, `{{child_name}}`, data, `{{event_time}}`, `{{location_name}}`), sem os botões de presença, mapa e presentes, ou com `<script>` ou `<form>`, e SHALL listar o que falta.

#### Scenario: HTML sem botão de presentes
- GIVEN um modelo com arte e HTML sem `data-action="gifts"`
- WHEN o admin tenta publicar
- THEN a publicação é recusada e o aviso cita `data-action="gifts"`

### Requirement: Liberação por público
O sistema SHALL permitir ao admin publicar um modelo para todos os clientes autorizados ou só para e-mails listados, e SHALL tornar autorizado todo e-mail listado.

#### Scenario: Modelo restrito
- GIVEN um modelo publicado só para ana@exemplo.com
- WHEN bruno@exemplo.com, autorizado, abre o catálogo
- THEN o modelo não aparece para ele

#### Scenario: E-mail novo na lista
- GIVEN um e-mail que não era cliente
- WHEN o admin o inclui na lista de um modelo restrito
- THEN esse e-mail passa a poder criar convites

### Requirement: Modelos só são arquivados
O sistema SHALL arquivar modelos em vez de excluí-los, e convites criados com um modelo arquivado SHALL continuar funcionando.

#### Scenario: Arquivar modelo em uso
- GIVEN um modelo com convites publicados
- WHEN o admin arquiva o modelo
- THEN ele some do catálogo e os convites continuam abrindo

### Requirement: Prévia com dados de exemplo
O sistema SHALL mostrar a prévia do modelo com dados fictícios de nomes curtos e longos, sem registrar presença.

#### Scenario: Confirmar presença na prévia
- GIVEN a prévia de um modelo
- WHEN alguém envia uma confirmação
- THEN aparece o aviso de que é uma prévia e nada é gravado
