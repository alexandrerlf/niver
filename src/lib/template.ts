import { z } from "zod";
import type { PublicInvitation } from "@/lib/invitation";

export type TemplateStatus = "draft" | "published" | "archived";
export type TemplateVisibility = "all" | "selected";

export type Template = {
  id: string;
  name: string;
  status: TemplateStatus;
  visibility: TemplateVisibility;
  html: string;
  art_path: string | null;
  updated_at: string;
};

export const STATUS_LABELS: Record<TemplateStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

export const emailSchema = z.email().transform((email) => email.toLowerCase());

export function parseEmails(text: string) {
  const entries = text
    .split(/[\s,;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  const emails = new Set<string>();
  const invalid: string[] = [];
  for (const entry of entries) {
    const parsed = emailSchema.safeParse(entry);
    if (parsed.success) emails.add(parsed.data);
    else invalid.push(entry);
  }
  return { emails: [...emails], invalid };
}

export const templateSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do modelo.").max(80),
  html: z.string().max(200000, "O HTML passou do limite de 200 mil caracteres."),
  visibility: z.enum(["all", "selected"]),
});

// Dados fictícios: a prévia mostra como textos longos e curtos cabem na arte.
export function sampleInvitation(template: Pick<Template, "id" | "html" | "art_path">): PublicInvitation {
  return {
    id: template.id,
    slug: "previa",
    status: "published",
    child_name: "Helena Maria",
    age: 6,
    event_date: "2027-03-14",
    event_time: "16:30",
    location_name: "Salão Estrela, Ponta Negra",
    maps_url: null,
    message: "Venha celebrar esse dia especial com a gente!",
    gifts: ["Livros", "Roupas tamanho 6"],
    image_path: template.art_path,
    html_template: template.html,
  };
}

export const STARTER_HTML = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Convite de {{child_name}}</title>
<style>
:root{--invite-accent:#c7401d;--invite-on-accent:#fff}
*{box-sizing:border-box}
body{margin:0;min-height:100dvh;background:#201a17;color:#fff;font-family:system-ui,sans-serif;text-align:center}
.art{display:block;width:100%;max-width:480px;margin:0 auto}
.info{max-width:480px;margin:0 auto;padding:20px 16px 32px}
h1{margin:0;font-size:32px;line-height:1.1}
p{margin:8px 0}
.action{display:block;width:100%;min-height:48px;margin-top:10px;padding:12px;border:0;border-radius:12px;background:var(--invite-accent);color:var(--invite-on-accent);font:inherit;font-weight:700;text-decoration:none;cursor:pointer}
</style>
</head>
<body>
<img class="art" src="{{art_url}}" alt="Arte do convite de {{child_name}}">
<main class="info">
<h1>{{child_name}}</h1>
<p>{{age_label}}</p>
<p>{{event_date}} às {{event_time}}</p>
<p>{{location_name}}</p>
<p>{{message}}</p>
<button class="action" type="button" data-action="rsvp">Confirmar presença</button>
<a class="action" data-action="maps">Ver no mapa</a>
<button class="action" type="button" data-action="gifts">Sugestões de presentes</button>
</main>
</body>
</html>
`;

