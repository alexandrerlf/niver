# Requisito: catálogo de modelos

## Objetivo

Dar ao admin um lugar para criar e publicar modelos de convite, e dar aos clientes acesso a esses modelos conforme forem liberados, sem custo de API de IA.

## Perfis

| Perfil | Quem é | O que faz |
|---|---|---|
| Admin | Dono do Niver, cadastrado em `private.admins` | Cria e publica modelos, libera clientes e também cria convites |
| Cliente | E-mail autorizado em `public.allowed_emails` | Escolhe um modelo liberado, cria e publica convites, vê presenças |
| Convidado | Quem recebe o link, sem login | Abre o convite, confirma presença, vê mapa e presentes |

Quem entra sem estar autorizado não vê modelos nem cria convites.

## Definição de "por demanda"

Um modelo fica disponível de uma destas formas, escolhida pelo admin em cada modelo:

- **Todos os clientes:** aparece para qualquer cliente autorizado assim que é publicado.
- **Só os e-mails indicados:** aparece apenas para esses e-mails. Quem estiver na lista passa a ser cliente autorizado.

O cliente pede um tema fora do app, por exemplo pelo WhatsApp. Um botão de pedido dentro do app fica para depois.

## Requisitos funcionais

### Admin

- **RF01.** Ver todos os modelos, com situação e forma de liberação, em `/admin/modelos`.
- **RF02.** Criar um modelo informando o nome. Ele nasce como rascunho, com um HTML inicial funcional.
- **RF04.** Enviar ou trocar a arte em JPG, PNG ou WebP, até 8 MB.
- **RF05.** Editar nome e HTML, e colar o HTML com ou sem cerca de código.
- **RF06.** Ver a prévia com dados fictícios antes de publicar.
- **RF07.** Ser avisado do que falta no HTML. Não é possível publicar sem arte, sem os campos obrigatórios, sem os três botões, ou com `<script>` ou `<form>`.
- **RF08.** Publicar e arquivar. Modelo arquivado some do catálogo, e os convites criados com ele continuam funcionando.
- **RF09.** Definir quem pode usar o modelo.
- **RF10.** Adicionar e remover clientes em `/admin/clientes`.

### Cliente

- **RF11.** Ver em `/novo` somente os modelos publicados e liberados para ele.
- **RF12.** Ver a prévia do modelo e preencher os dados da festa.
- **RF13.** Criar o convite como rascunho, conferir a prévia e publicar.
- **RF14.** Editar os dados depois de publicar, sem nova arte.
- **RF16.** Compartilhar o link e acompanhar as presenças.
- **RF19.** Excluir um convite, com confirmação, pela lista de convites ou pela tela dele. O link deixa de funcionar e as presenças são apagadas.

### Convidado

- **RF17.** Abrir o convite em `/c/<slug>` sem login.
- **RF18.** Confirmar presença com nome e número de pessoas, abrir o mapa e ver os presentes.

## Regras de negócio

- **RN01.** A arte de um modelo não contém dados de um cliente. Nome, idade, data, horário, local e mensagem entram por HTML, e o cliente nunca precisa de IA para criar um convite.
- **RN01b.** Um elemento com `data-letters="/alfabetos/<tema>/<estilo>"` é montado com as imagens desse alfabeto, em `public/alfabetos`. Letras acentuadas fora do alfabeto usam a letra base, e outros símbolos são omitidos. Para criar um alfabeto, use `scripts/fatiar-alfabeto.mjs`.
- **RN02.** Cada convite guarda uma cópia do HTML do modelo. Editar um modelo não altera convites existentes.
- **RN03.** Modelos não são excluídos, só arquivados, porque os convites apontam para a arte deles.
- **RN04.** Só o admin envia arte, e só nos modelos. O convite usa a arte do modelo escolhido, e excluir um convite nunca apaga a arte do modelo.
- **RN05.** A prévia nunca registra presença.
- **RN06.** A permissão é aplicada no banco, por RLS, e não só nas telas.
- **RN07.** As janelas de confirmar presença e de sugestões são do sistema, iguais em todos os modelos, e a presença fica gravada no app. O modelo pode mudar só o visual delas, pelas classes `nv-dialog`, `nv-box`, `nv-sub`, `nv-btn`, `nv-primary`, `nv-status`, `nv-error`, `nv-ok` e `nv-hint`. Uma sugestão escrita como `Rótulo: valor` mostra o rótulo em destaque.

## Requisitos não funcionais

- **RNF01.** Sem custo de API de IA no fluxo principal.
- **RNF02.** O HTML do modelo roda em sandbox, sem acesso a cookies do app e sem executar scripts próprios.
- **RNF03.** Arte enviada direto ao Storage, para evitar o limite de 4,5 MB das funções da Vercel.
- **RNF04.** Telas utilizáveis a partir de 320px.

## Fora do escopo

- Pedido de tema dentro do app.
- Cobrança e planos.
- Atualizar convites existentes para a versão nova de um modelo.
- Limite de envios na confirmação de presença.

## Critérios de aceite

1. Um modelo em rascunho não aparece para clientes.
2. Um modelo publicado para todos aparece para qualquer cliente autorizado.
3. Um modelo restrito aparece só para os e-mails indicados.
4. Um e-mail adicionado a um modelo restrito consegue criar convites.
5. Um cliente não consegue criar nem alterar modelos, nem se autorizar, nem pela API.
6. Editar um modelo não muda um convite já publicado.
7. O convite publicado funciona sem login, e a presença aparece para o dono.
