---
name: criar-modelo
description: Cria ou ajusta um modelo de convite do Niver (arte limpa + HTML com campos e botões). Use quando pedirem um tema novo de convite, mudar o layout de um modelo existente, trocar a arte de um modelo ou cadastrar um modelo no catálogo.
---

# Criar um modelo de convite

Um modelo é uma arte de fundo sem dados escritos mais um HTML que coloca nome, data, local e botões por cima. Os modelos prontos ficam em `templates/<tema>/` e servem de referência: `minecraft` posiciona os textos sobre áreas desenhadas na arte; `bluey` desenha cartões e botões no próprio HTML, o que permite trocar a arte sem reposicionar nada.

## 1. Combine com o dono antes de começar

Pergunte, numa única rodada:
- **Arte:** o dono envia a arte, ou você cria uma cena original? Personagens de séries, jogos e marcas não podem ser desenhados ou recriados por você; com personagens, use somente a imagem que o dono enviou. Sem imagem, crie uma cena original no clima do tema, sem os personagens.
- **Movimento:** estático, sutil ou animado (só CSS).
- **Entrega:** só os arquivos no repositório, ou também cadastrar no Supabase como rascunho.

## 2. Arte

- Tamanho 941 × 1672 (proporção 9:16 do cartão), JPG com qualidade perto de 90, até 8 MB.
- Sem nome, idade, data, local ou qualquer texto do cliente. Esses dados entram pelo HTML.
- Deixe livre a área onde os textos e botões vão ficar.
- Guarde a fonte editável junto (por exemplo `cenario.svg`) e o resultado final como `arte.jpg`.

## 3. HTML

Comece de `templates/bluey/template.html`, que já tem a estrutura certa. Regras que o app valida (`templateProblems` em `src/lib/render.ts`):

- Campos obrigatórios: `{{art_url}}`, `{{child_name}}`, `{{event_date}}` ou `{{event_date_short}}`, `{{event_time}}`, `{{location_name}}`.
- Campos opcionais: `{{child_name_first}}`, `{{child_name_rest}}`, `{{age_label}}`, `{{event_weekday}}`, `{{message}}`.
- Botões: `data-action="rsvp"`, `data-action="maps"` e `data-action="gifts"`. O botão de presentes some sozinho quando não há sugestões.
- Precisa ter `</head>` e `</body>`. Proibido `<script>` e `<form>`: o convite roda em sandbox e eles não funcionariam.
- `data-fit` diminui a fonte até o texto caber. A caixa precisa ter altura fixa.
- `data-letters="/alfabetos/<tema>/<estilo>"` monta o texto com as imagens de `public/alfabetos` (crie alfabetos com `scripts/fatiar-alfabeto.mjs`).
- Campos opcionais vazios precisam de texto padrão, por exemplo `.age:empty::before{content:"Parabéns!"}`.
- Fontes só do Google Fonts; imagens só da arte e do próprio app (é o que o CSP libera).
- As janelas de presença e presentes são do sistema. O modelo muda só o visual, pelas classes `nv-dialog`, `nv-box`, `nv-sub`, `nv-btn`, `nv-primary`, `nv-status`, `nv-error`, `nv-ok` e `nv-hint`.
- Respeite `prefers-reduced-motion` em qualquer animação.

## 4. Verifique

1. `npm run check`: o teste `src/lib/templates.test.ts` valida todo modelo em `templates/`.
2. Rode o app e abra `/previa/modelo/<id>`, ou monte um backend de teste, e confira por captura de tela:
   - nome curto ("Lia"), nome longo ("Maria Eduarda Albuquerque"), sem idade e sem mensagem;
   - local longo, com endereço completo;
   - telas de 320 px e 390 px e o computador;
   - as janelas de presença e de presentes abertas.
3. Nenhum texto pode vazar da caixa nem cobrir a parte importante da arte.

## 5. Cadastre

Modelos vivem no banco, não no código: um deploy não cria modelo. Para cadastrar:
- **Pelo app:** em `/admin/modelos`, crie o modelo, envie `arte.jpg`, cole o `template.html`, confira a prévia e toque em "Publicar para clientes".
- **Pelo Supabase, se o dono pedir:** insira em `public.templates` como `draft`, com o HTML. A arte precisa ser enviada pelo app, porque o upload exige o login de admin. Depois de a arte entrar, confira que o status ficou `published`.

Ao terminar, mostre ao dono as capturas da prévia e a arte limpa.
