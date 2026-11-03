import type { PublicInvitation } from "@/lib/invitation";

const REQUIRED_TOKENS = ["{{art_url}}", "{{child_name}}", "{{event_time}}", "{{location_name}}"];
const REQUIRED_ACTIONS = ["rsvp", "maps", "gifts"];

export function stripCodeFence(text: string) {
  return text
    .trim()
    .replace(/^```(?:html)?\s*\n/i, "")
    .replace(/\n```\s*$/, "")
    .trim();
}

export function templateProblems(template: string) {
  const problems = REQUIRED_TOKENS.filter((token) => !template.includes(token));
  if (!/\{\{event_date(_short)?\}\}/.test(template)) problems.push("{{event_date}}");
  for (const action of REQUIRED_ACTIONS) {
    if (!template.includes(`data-action="${action}"`)) problems.push(`data-action="${action}"`);
  }
  for (const tag of ["</head>", "</body>"]) {
    if (!template.toLowerCase().includes(tag)) problems.push(tag);
  }
  // O sandbox bloqueia os dois: avisar aqui evita um botão morto no convite publicado.
  if (/<script\b/i.test(template)) problems.push("remover <script>");
  if (/<form\b/i.test(template)) problems.push("remover <form>");
  return problems;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatDateShort(date: string | null) {
  return date ? date.split("-").reverse().join("/") : "";
}

export function formatWeekday(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export function formatTime(time: string | null) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  return `${Number(hours)}h${minutes === "00" ? "" : minutes}`;
}

export function formatAge(age: number | null) {
  if (age === null) return "";
  return age === 1 ? "1 ano" : `${age} anos`;
}

export function splitName(name: string) {
  const [first = "", ...rest] = name.trim().split(/\s+/);
  return { first, rest: rest.join(" ") };
}

function mapsHref(invitation: PublicInvitation) {
  return (
    invitation.maps_url ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location_name)}`
  );
}

const RUNTIME_STYLE = `
.nv-dialog{border:0;padding:0;background:transparent;width:min(92vw,420px);color:#201a17;font:16px/1.4 system-ui,sans-serif;text-align:left}
.nv-dialog::backdrop{background:rgba(10,8,6,.72)}
.nv-box{background:#fffaf2;border-radius:18px;padding:22px;box-shadow:0 16px 50px rgba(0,0,0,.45)}
.nv-box h2{margin:0 0 12px;font-size:24px;line-height:1.15}
.nv-box label{display:block;margin:12px 0 4px;font-weight:600}
.nv-box input{box-sizing:border-box;width:100%;min-height:46px;padding:9px 11px;border:1px solid #b9ab9c;border-radius:10px;font:inherit;background:#fff;color:inherit}
.nv-box ul{margin:0;padding-left:20px}.nv-box li{margin:6px 0}
.nv-row{display:flex;gap:10px;margin-top:18px}
.nv-btn{flex:1;min-height:46px;border:1px solid #b9ab9c;border-radius:10px;background:#fff;color:inherit;font:inherit;font-weight:700;cursor:pointer}
.nv-primary{background:var(--invite-accent,#c7401d);border-color:transparent;color:var(--invite-on-accent,#fff)}
.nv-status{min-height:22px;margin:10px 0 0;font-size:15px}
.nv-error{color:#b3261e}
.nv-sub{margin:-6px 0 8px;opacity:.85}
.nv-hint{margin:12px 0 0;font-size:14px;opacity:.7}
.nv-box li b{font-weight:700}
.nv-word{display:inline-flex;align-items:flex-end;vertical-align:top}
.nv-word img{display:block;height:1.6em;max-width:none;margin:-.4em -.02em -.2em}
.nv-word img.nv-digit{height:1.76em;margin-top:-.56em}
`;

const RUNTIME_MARKUP = `
<dialog class="nv-dialog" id="nv-rsvp" aria-labelledby="nv-rsvp-title"><div class="nv-box">
<h2 id="nv-rsvp-title">Confirmar presença</h2>
<div id="nv-rsvp-fields">
<p class="nv-sub" id="nv-rsvp-sub">Preencha e confirme para a família.</p>
<label for="nv-name">Seu nome</label><input id="nv-name" autocomplete="name" maxlength="120" placeholder="Ex.: Maria Silva">
<label for="nv-size">Quantas pessoas vão?</label><input id="nv-size" type="number" inputmode="numeric" min="1" max="20" value="1">
</div>
<p class="nv-status" id="nv-status" role="status"></p>
<div class="nv-row"><button class="nv-btn" type="button" id="nv-cancel" data-nv-close>Cancelar</button><button class="nv-btn nv-primary" type="button" id="nv-send">Confirmar</button></div>
<p class="nv-hint" id="nv-hint">A confirmação chega direto para a família.</p>
</div></dialog>
<dialog class="nv-dialog" id="nv-gifts" aria-labelledby="nv-gifts-title"><div class="nv-box">
<h2 id="nv-gifts-title">Sugestões de presentes</h2>
<p class="nv-sub" id="nv-gifts-sub">Algumas ideias para o aniversário:</p>
<ul id="nv-gift-list"></ul>
<div class="nv-row"><button class="nv-btn nv-primary" type="button" data-nv-close>Fechar</button></div>
</div></dialog>`;

const RUNTIME_SCRIPT = `
(function(){
var c=JSON.parse(document.getElementById("nv-config").textContent);
var $=function(id){return document.getElementById(id)};
var all=function(sel){return Array.prototype.slice.call(document.querySelectorAll(sel))};
var glyph=function(ch){
  var up=ch.toUpperCase(),known=/^[A-Z0-9ÁÀÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜÇ]$/;
  if(known.test(up))return up;
  var bare=up.normalize("NFD")[0];
  return known.test(bare)?bare:"";
};
var fit=function(){all("[data-fit]").forEach(function(el){
  el.style.fontSize="";
  var size=parseFloat(getComputedStyle(el).fontSize),steps=0;
  while(steps++<40&&size>6&&(el.scrollWidth>el.clientWidth||el.scrollHeight>el.clientHeight)){size*=.94;el.style.fontSize=size+"px"}
})};
all("[data-letters]").forEach(function(el){
  var base=el.getAttribute("data-letters"),text=el.textContent.trim();
  if(!text||!/^[/]alfabetos[/][a-z0-9/-]+$/.test(base))return;
  el.textContent="";
  el.setAttribute("role","img");
  el.setAttribute("aria-label",text);
  text.split(/\\s+/).forEach(function(word,index){
    var box=document.createElement("span");
    box.className="nv-word";
    Array.from(word).forEach(function(ch){
      var letter=glyph(ch);
      if(!letter)return;
      var img=new Image();
      img.alt="";
      // Nas folhas de alfabeto, os números saem uns 10% mais baixos que as letras.
      if(/[0-9]/.test(letter))img.className="nv-digit";
      img.addEventListener("load",fit);
      img.src=c.origin+base+"/"+letter.codePointAt(0).toString(16)+".webp";
      box.appendChild(img);
    });
    if(index)el.appendChild(document.createTextNode(" "));
    el.appendChild(box);
  });
});
fit();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener("loadingdone",fit);
window.addEventListener("load",fit);
window.addEventListener("resize",fit);
all('[data-action="maps"]').forEach(function(el){
  if(el.tagName==="A"){el.href=c.mapsUrl;el.target="_blank";el.rel="noopener"}
  else el.addEventListener("click",function(){window.open(c.mapsUrl,"_blank","noopener")});
});
var gifts=all('[data-action="gifts"]');
if(!c.gifts.length)gifts.forEach(function(el){el.hidden=true;el.style.display="none"});
if(c.childName){
  $("nv-rsvp-sub").textContent="Preencha e confirme para a família de "+c.childName+".";
  $("nv-gifts-sub").textContent="Algumas ideias para o aniversário de "+c.childName+":";
}
c.gifts.forEach(function(gift){
  var li=document.createElement("li"),cut=gift.indexOf(":"),label=document.createElement("b");
  label.textContent=cut>0?gift.slice(0,cut+1):gift;
  li.appendChild(label);
  if(cut>0&&gift.slice(cut+1).trim())li.appendChild(document.createTextNode(" "+gift.slice(cut+1).trim()));
  $("nv-gift-list").appendChild(li);
});
var say=function(text,kind){var status=$("nv-status");status.textContent=text;status.className="nv-status"+(kind?" nv-"+kind:"")};
gifts.forEach(function(el){el.addEventListener("click",function(e){e.preventDefault();$("nv-gifts").showModal()})});
all('[data-action="rsvp"]').forEach(function(el){el.addEventListener("click",function(e){e.preventDefault();if(!$("nv-rsvp-fields").hidden)say("");$("nv-rsvp").showModal();$("nv-name").focus()})});
all("[data-nv-close]").forEach(function(el){el.addEventListener("click",function(){el.closest("dialog").close()})});
all(".nv-dialog").forEach(function(dialog){dialog.addEventListener("click",function(e){if(e.target===dialog)dialog.close()})});
$("nv-send").addEventListener("click",function(){
  var send=$("nv-send"),name=$("nv-name").value.trim(),size=parseInt($("nv-size").value,10);
  if(!name){say("Digite seu nome para confirmar.","error");$("nv-name").focus();return}
  if(!(size>=1&&size<=20)){say("Informe de 1 a 20 pessoas.","error");$("nv-size").focus();return}
  if(!c.rsvpUrl){say("Esta é uma prévia: a presença não foi enviada.","error");return}
  send.disabled=true;say("Enviando...");
  fetch(c.rsvpUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:name,partySize:size})})
    .then(function(res){if(!res.ok)throw new Error("rsvp");$("nv-rsvp-fields").hidden=true;send.hidden=true;$("nv-hint").hidden=true;$("nv-cancel").textContent="Fechar";$("nv-cancel").className="nv-btn nv-primary";say("Presença confirmada. Obrigado!","ok")})
    .catch(function(){send.disabled=false;say("Não foi possível enviar. Tente de novo.","error")});
});
})();`;

export function renderInvitation(
  invitation: PublicInvitation,
  options: { artUrl: string; appOrigin: string; pageUrl: string; nonce: string; preview?: boolean },
) {
  const { artUrl, appOrigin, pageUrl, nonce, preview } = options;
  const name = splitName(invitation.child_name);
  const values: Record<string, string> = {
    art_url: artUrl,
    child_name: invitation.child_name,
    child_name_first: name.first,
    child_name_rest: name.rest,
    age_label: formatAge(invitation.age),
    event_date: formatDate(invitation.event_date),
    event_date_short: formatDateShort(invitation.event_date),
    event_weekday: formatWeekday(invitation.event_date),
    event_time: formatTime(invitation.event_time),
    location_name: invitation.location_name,
    message: invitation.message,
  };
  const body = (invitation.html_template ?? "").replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    escapeHtml(values[key] ?? ""),
  );

  const title = [invitation.child_name, values.age_label].filter(Boolean).join(", ");
  const summary = `${values.event_date}, ${values.event_time} · ${invitation.location_name}`;
  const head = `<meta property="og:type" content="website">
<meta property="og:url" content="${escapeHtml(pageUrl)}">
<meta property="og:title" content="${escapeHtml(`Convite: ${title}`)}">
<meta property="og:description" content="${escapeHtml(summary)}">
<meta property="og:image" content="${escapeHtml(artUrl)}">
<style>${RUNTIME_STYLE}</style>`;

  const config = JSON.stringify({
    origin: appOrigin,
    childName: invitation.child_name,
    rsvpUrl: preview ? null : `${appOrigin}/api/rsvp/${invitation.slug}`,
    mapsUrl: mapsHref(invitation),
    gifts: invitation.gifts,
  }).replace(/</g, "\\u003c");
  const tail = `${RUNTIME_MARKUP}
<script id="nv-config" type="application/json" nonce="${nonce}">${config}</script>
<script nonce="${nonce}">${RUNTIME_SCRIPT}</script>`;

  return insertBefore(insertBefore(body, "</head>", head), "</body>", tail);
}

function insertBefore(html: string, tag: string, content: string) {
  const index = html.toLowerCase().lastIndexOf(tag);
  return index < 0 ? html : `${html.slice(0, index)}${content}\n${html.slice(index)}`;
}

// O sandbox dá ao convite uma origem opaca: o HTML do modelo nunca alcança
// os cookies do app, e só o script injetado pelo servidor (com nonce) executa.
export function invitationCsp(options: { artUrl: string; appOrigin: string; nonce: string }) {
  const artOrigin = new URL(options.artUrl).origin;
  return [
    "default-src 'none'",
    `script-src 'nonce-${options.nonce}'`,
    "style-src 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    `img-src data: ${artOrigin} ${options.appOrigin}`,
    `connect-src ${options.appOrigin}`,
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'self'",
    "sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation",
  ].join("; ");
}
