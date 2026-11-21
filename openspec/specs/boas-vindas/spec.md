# boas-vindas Specification

## Purpose
O primeiro contato do cliente logado com o Niver: um tutorial curto para aprender a usar e o convite para instalar o app no celular ou no computador.

## Requirements

### Requirement: Tutorial de boas-vindas uma vez por conta
O sistema SHALL mostrar, na primeira vez que o cliente entra no app, um tutorial em quatro passos (escolher o modelo, preencher a festa, publicar e compartilhar, acompanhar as presenças), e SHALL registrar na conta que ele foi visto, para não mostrar de novo em nenhum aparelho.

#### Scenario: Primeiro acesso
- **WHEN** um cliente que nunca viu o tutorial abre `/convites`
- **THEN** vê o tutorial começando pelo primeiro passo

#### Scenario: Cliente conclui ou pula o tutorial
- **WHEN** o cliente toca em "Começar" no último passo ou em "Pular" em qualquer passo
- **THEN** o tutorial fecha e fica marcado como visto na conta

#### Scenario: Acesso em outro aparelho
- **WHEN** um cliente que já viu o tutorial entra no app por outro aparelho
- **THEN** o tutorial não aparece

#### Scenario: Rever o tutorial
- **WHEN** o cliente toca em "Rever tutorial" em "Minha conta"
- **THEN** o tutorial aparece de novo desde o primeiro passo

### Requirement: Aviso para instalar o app
O sistema SHALL oferecer a instalação do app ao cliente logado depois do tutorial, e MUST NOT mostrar o aviso quando o app já estiver aberto como app instalado ou já tiver sido instalado naquele aparelho.

#### Scenario: Navegador que permite instalar
- **WHEN** um cliente que já viu o tutorial usa um navegador que oferece instalação, como o Chrome no Android
- **THEN** vê o aviso com o botão "Instalar", que abre a instalação do próprio navegador

#### Scenario: iPhone no Safari
- **WHEN** um cliente que já viu o tutorial abre o app no Safari do iPhone, fora do modo app
- **THEN** vê o aviso com o passo a passo: tocar em Compartilhar e depois em "Adicionar à Tela de Início"

#### Scenario: App já instalado
- **WHEN** o cliente abre o Niver pelo ícone do app instalado
- **THEN** o aviso não aparece

#### Scenario: Instalação concluída
- **WHEN** o cliente instala o app a partir do aviso
- **THEN** o aviso some e não volta naquele aparelho

#### Scenario: Cliente fecha o aviso
- **WHEN** o cliente fecha o aviso sem instalar
- **THEN** o aviso só volta a aparecer naquele aparelho depois de 14 dias

#### Scenario: Tutorial ainda aberto
- **WHEN** o tutorial está aberto
- **THEN** o aviso de instalação não aparece ao mesmo tempo
