# Template: janelas (modais) do convite Minecraft

Use este documento como instrução para implementar as janelas "Confirmar presença" e "Sugestões de presentes" **idênticas** às do convite do Samuel Dante. Estilo: painel escuro pixelado, tipografia VT323, destaque verde Minecraft.

## 1. Tokens de design

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#070b16` | fundo da página |
| `--panel` | `#111a2b` | fundo da janela |
| `--ink` | `#f2f6ff` | texto |
| `--green` | `#4cd137` | título, foco, destaques |
| `--green-d` | `#1f7a14` | botão principal |
| borda da janela | `#3a4560` (4px) + borda interna `#0a1020` (inset 4px) | moldura "pedra" |
| fundo de campos | `#060a14` | inputs e itens da lista |
| erro | `#ff7b6b` | mensagem de validação |
| botão principal (borda) | `#7dff63`, hover `#28a01a` | |
| botão secundário | fundo `#1b2438`, hover `#26314b` | |

Fonte: **VT323** (Google Fonts), fallback `ui-monospace, monospace`. Sem cantos arredondados nas janelas, campos e botões (`border-radius:0`).

Tamanhos: texto base 23px, título 34px, inputs e botões 26px, erro 21px, dica 19px.

## 2. Comportamento

- Usar o elemento nativo `<dialog>` com `showModal()` (fallback: atributo `open`). Isso já dá foco preso, Esc para fechar e `::backdrop`.
- Fundo escurecido: `dialog::backdrop { background: rgba(2,4,10,.78) }`.
- Largura da caixa: `min(92vw, 430px)`, centralizada.
- Fechar também ao clicar fora da caixa (clique no próprio `<dialog>`).
- Ao abrir "Confirmar presença", limpar o erro e focar o campo de nome.
- Botões e áreas clicáveis do convite têm brilho verde no hover/foco (`box-shadow: 0 0 0 3px #7dff63, 0 0 22px 4px rgba(125,255,99,.55)`); respeitar `prefers-reduced-motion`.

### Janela 1: Confirmar presença

Campos e regras:
- **Seu nome** (texto, `autocomplete="name"`, placeholder "Ex.: Maria Silva"): obrigatório. Erro: "Digite seu nome para confirmar."
- **Quantas pessoas vão?** (número, min 1, max 20, padrão 1, `inputmode="numeric"`): obrigatório, mínimo 1. Erro: "Informe quantas pessoas vão."
- Botões: **Cancelar** (secundário, ocupa menos largura) e **Enviar e-mail** (principal).
- Dica abaixo: "Vai abrir o seu app de e-mail com a mensagem pronta. É só tocar em enviar."

Ao enviar (validado), abrir `mailto:` para `alexandrerodrigueslopesfilho@gmail.com` e fechar a janela:
- Assunto: `Confirmação de presença - Samuel Dante 4 anos`
- Corpo:
  ```
  Olá! Confirmo presença no aniversário de 4 anos do Samuel Dante.

  Nome: {nome}
  Pessoas: {quantidade}

  Data: 11/10/2026 (domingo), às 18h30
  Local: Condomínio Luar Ponta Negra (Churrasqueira)
  ```
- Usar `encodeURIComponent` em assunto e corpo.

### Janela 2: Sugestões de presentes

- Título: "Sugestões de presentes". Subtítulo: "Algumas ideias para o aniversário do Samuel Dante:"
- Lista (cada item em cartão escuro com barra verde de 4px à esquerda; rótulo em verde, valor em branco):
  - **Roupas:** TAM 4 anos
  - **Calçados:** 26
  - **Perfume infantil**
  - **Brinquedos:** Blocos magnéticos, Livros, Minecraft
- Um único botão principal: **Fechar**.

## 3. Referência de implementação (HTML + CSS + JS puro)

```html
<dialog id="dlg" aria-labelledby="t">
  <div class="box">
    <h2 id="t">Confirmar presença</h2>
    <p>Preencha e envie por e-mail para a família do Samuel Dante.</p>
    <label for="nome">Seu nome</label>
    <input id="nome" type="text" autocomplete="name" placeholder="Ex.: Maria Silva">
    <label for="qtd">Quantas pessoas vão?</label>
    <input id="qtd" type="number" min="1" max="20" value="1" inputmode="numeric">
    <div class="err" id="err" role="alert"></div>
    <div class="row">
      <button class="btn no" id="cancel" type="button">Cancelar</button>
      <button class="btn go" id="send" type="button">Enviar e-mail</button>
    </div>
    <div class="hint">Vai abrir o seu app de e-mail com a mensagem pronta. É só tocar em enviar.</div>
  </div>
</dialog>

<dialog id="gdlg" aria-labelledby="gt">
  <div class="box">
    <h2 id="gt">Sugestões de presentes</h2>
    <p>Algumas ideias para o aniversário do Samuel Dante:</p>
    <ul class="gl">
      <li><b>Roupas:</b> TAM 4 anos</li>
      <li><b>Calçados:</b> 26</li>
      <li><b>Perfume infantil</b></li>
      <li><b>Brinquedos:</b> Blocos magnéticos, Livros, Minecraft</li>
    </ul>
    <div class="row"><button class="btn go" id="gclose" type="button">Fechar</button></div>
  </div>
</dialog>
```

```css
:root{--panel:#111a2b;--ink:#f2f6ff;--green:#4cd137;--green-d:#1f7a14}
body{font-family:'VT323',ui-monospace,monospace}
dialog{border:0;padding:0;background:transparent;max-width:none;width:100%;color:var(--ink)}
dialog::backdrop{background:rgba(2,4,10,.78)}
.box{margin:auto;width:min(92vw,430px);background:var(--panel);border:4px solid #3a4560;
  box-shadow:inset 0 0 0 4px #0a1020,0 12px 40px rgba(0,0,0,.6);padding:22px 20px 20px;font-size:23px}
.box h2{margin:0 0 4px;font-weight:400;font-size:34px;color:var(--green);line-height:1}
.box p{margin:0 0 14px;opacity:.85;line-height:1.1}
label{display:block;margin:12px 0 4px}
input{width:100%;font:inherit;font-size:26px;color:var(--ink);background:#060a14;border:3px solid #3a4560;padding:8px 10px;border-radius:0}
input:focus{outline:none;border-color:var(--green)}
.row{display:flex;gap:10px;margin-top:20px}
.btn{flex:1;font:inherit;font-size:26px;padding:10px 12px;border:3px solid;cursor:pointer;color:#fff;border-radius:0}
.go{background:var(--green-d);border-color:#7dff63}
.go:hover,.go:focus-visible{background:#28a01a;outline:none}
.no{background:#1b2438;border-color:#3a4560;flex:.6}
.no:hover,.no:focus-visible{background:#26314b;outline:none}
.gl{list-style:none;margin:0;padding:0}
.gl li{padding:8px 10px;margin-bottom:8px;background:#060a14;border-left:4px solid var(--green);line-height:1.05}
.gl b{color:var(--green);font-weight:400}
.err{color:#ff7b6b;min-height:22px;margin-top:8px;font-size:21px}
.hint{font-size:19px;opacity:.65;margin-top:12px;line-height:1.05}
```

```js
const TO = "alexandrerodrigueslopesfilho@gmail.com";
const open  = d => d.showModal ? d.showModal() : d.setAttribute('open','');
const close = d => d.close ? d.close() : d.removeAttribute('open');

const dlg = document.getElementById('dlg'), g = document.getElementById('gdlg');
const nome = document.getElementById('nome'), qtd = document.getElementById('qtd'), err = document.getElementById('err');

document.getElementById('rsvp').onclick  = () => { err.textContent=''; open(dlg); nome.focus(); };
document.getElementById('gifts').onclick = () => open(g);
document.getElementById('cancel').onclick = () => close(dlg);
document.getElementById('gclose').onclick = () => close(g);
[dlg, g].forEach(d => d.addEventListener('click', e => { if (e.target === d) close(d); }));

document.getElementById('send').onclick = () => {
  const n = nome.value.trim(), q = parseInt(qtd.value, 10);
  if (!n) { err.textContent = 'Digite seu nome para confirmar.'; nome.focus(); return; }
  if (!q || q < 1) { err.textContent = 'Informe quantas pessoas vão.'; qtd.focus(); return; }
  const subj = "Confirmação de presença - Samuel Dante 4 anos";
  const body = `Olá! Confirmo presença no aniversário de 4 anos do Samuel Dante.\n\nNome: ${n}\nPessoas: ${q}\n\nData: 11/10/2026 (domingo), às 18h30\nLocal: Condomínio Luar Ponta Negra (Churrasqueira)`;
  const a = document.createElement('a');
  a.href = `mailto:${TO}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  a.target = "_blank"; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
  close(dlg);
};
```

## 4. Instruções para o Claude Code

1. Manter o visual exatamente como nos tokens e CSS acima (sem bordas arredondadas, VT323, verde `#4cd137`).
2. Se o projeto usar framework (React, Vue etc.), converter para componentes, mas manter `<dialog>` nativo, as mesmas classes/estilos e o mesmo texto.
3. Manter os textos, mensagens de erro e o formato do e-mail exatamente como descritos.
4. Se os dados do evento (data, horário, local, e-mail de destino, itens de presente) mudarem, centralizá-los em constantes em um único lugar.

## 5. Checklist de aceite

- [ ] Abre e fecha por botão, clique fora e Esc.
- [ ] Nome vazio ou quantidade inválida mostram o erro certo e mantêm a janela aberta.
- [ ] Envio abre o app de e-mail com destinatário, assunto e corpo corretos.
- [ ] Funciona no celular (largura 92vw) e no computador (máx. 430px).
- [ ] Campo foca em verde; botões respondem a hover e teclado.
- [ ] Visual idêntico ao convite atual.
