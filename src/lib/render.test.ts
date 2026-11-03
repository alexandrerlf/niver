import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { makeSlug, type PublicInvitation } from "@/lib/invitation";
import {
  formatDate,
  formatDateShort,
  formatTime,
  formatWeekday,
  invitationCsp,
  renderInvitation,
  splitName,
  stripCodeFence,
  templateProblems,
} from "@/lib/render";
import { STARTER_HTML, parseEmails } from "@/lib/template";

const template = `<!doctype html><html><head><title>Convite</title></head><body>
<img src="{{art_url}}" alt=""><h1>{{child_name}}</h1><p>{{age_label}}</p>
<p>{{event_date}} {{event_time}} {{location_name}}</p><p>{{message}}</p>
<button data-action="rsvp">Confirmar</button><a data-action="maps">Mapa</a>
<button data-action="gifts">Presentes</button></body></html>`;

const invitation: PublicInvitation = {
  id: "1",
  slug: "samuel-4-anos-ab12",
  status: "published",
  child_name: `<script>alert("x")</script>`,
  age: 4,
  event_date: "2026-10-11",
  event_time: "18:30",
  location_name: "Condomínio Luar & Ponta Negra",
  maps_url: null,
  message: "$& Vamos juntos?",
  gifts: ["</script><img src=x>"],
  image_path: "u/i/a.jpg",
  html_template: template,
};

const options = {
  artUrl: "https://abc.supabase.co/storage/v1/object/public/invitation-art/u/i/a.jpg",
  appOrigin: "https://app.example",
  pageUrl: "https://app.example/c/samuel-4-anos-ab12",
  nonce: "n0nce",
};

describe("renderInvitation", () => {
  const html = renderInvitation(invitation, options);

  it("escapa dados do usuário no template", () => {
    expect(html).not.toContain(`<h1><script>`);
    expect(html).toContain("&lt;script&gt;alert");
    expect(html).toContain("Luar &amp; Ponta Negra");
    expect(html).toContain("<p>$&amp; Vamos juntos?</p>");
  });

  it("não deixa dados fecharem o script de configuração", () => {
    expect(html).not.toContain("</script><img src=x>");
    expect(html).toContain("\\u003c/script>\\u003cimg src=x>");
  });

  it("formata dados e injeta o runtime antes do fechamento do body", () => {
    expect(html).toContain("domingo, 11/10/2026 18h30");
    expect(html).toContain("<p>4 anos</p>");
    expect(html).toContain(`"rsvpUrl":"https://app.example/api/rsvp/samuel-4-anos-ab12"`);
    expect(html.indexOf("nv-rsvp")).toBeLessThan(html.lastIndexOf("</body>"));
  });

  it("gera um runtime com sintaxe válida", () => {
    const runtime = html.match(/<script nonce="n0nce">([\s\S]*?)<\/script>/)?.[1] ?? "";
    expect(runtime).toContain("data-letters");
    expect(() => new Function(runtime)).not.toThrow();
  });

  it("usa busca do mapa quando não há link", () => {
    expect(html).toContain("google.com/maps/search");
  });

  it("separa o nome em duas linhas", () => {
    const named = renderInvitation(
      {
        ...invitation,
        child_name: "Maria  Eduarda Souza",
        html_template: template.replace("</body>", "<b>{{child_name_first}}|{{child_name_rest}}</b></body>"),
      },
      options,
    );
    expect(named).toContain("<b>Maria|Eduarda Souza</b>");
    expect(splitName("Ana")).toEqual({ first: "Ana", rest: "" });
  });
});

describe("invitationCsp", () => {
  it("isola a página e restringe imagem e rede", () => {
    const csp = invitationCsp(options);
    expect(csp).toContain("script-src 'nonce-n0nce'");
    expect(csp).toContain("img-src data: https://abc.supabase.co");
    expect(csp).toContain("connect-src https://app.example");
    expect(csp).toMatch(/sandbox allow-scripts/);
    expect(csp).not.toContain("allow-same-origin");
  });
});

describe("templateProblems", () => {
  it("aceita um template completo", () => {
    expect(templateProblems(template)).toEqual([]);
  });

  it("aponta o que falta", () => {
    expect(templateProblems("<html></html>")).toEqual(
      expect.arrayContaining(["{{art_url}}", 'data-action="rsvp"', "</head>"]),
    );
  });

  it("aceita a data curta no lugar da completa", () => {
    expect(templateProblems(template.replace("{{event_date}}", "{{event_date_short}}"))).toEqual([]);
  });

  it("recusa o que o sandbox bloquearia", () => {
    expect(templateProblems(template.replace("</body>", "<script>x()</script><form></form></body>"))).toEqual(
      ["remover <script>", "remover <form>"],
    );
  });

  it("aceita o modelo Minecraft", () => {
    const minecraft = readFileSync("templates/minecraft/template.html", "utf8");
    expect(templateProblems(minecraft)).toEqual([]);
    expect(templateProblems(STARTER_HTML)).toEqual([]);
  });
});

describe("prévia", () => {
  it("não envia presença", () => {
    expect(renderInvitation(invitation, { ...options, preview: true })).toContain(`"rsvpUrl":null`);
  });
});

describe("parseEmails", () => {
  it("normaliza, remove repetidos e aponta inválidos", () => {
    expect(parseEmails("Ana@Exemplo.com\nana@exemplo.com, bia@exemplo.com;nada")).toEqual({
      emails: ["ana@exemplo.com", "bia@exemplo.com"],
      invalid: ["nada"],
    });
  });
});

describe("formatos", () => {
  it("formata horários", () => {
    expect(formatTime("17:00")).toBe("17h");
    expect(formatTime("09:30")).toBe("9h30");
  });

  it("não desloca a data pelo fuso", () => {
    expect(formatDate("2026-01-01")).toBe("quinta-feira, 01/01/2026");
    expect(formatDateShort("2026-10-11")).toBe("11/10/2026");
    expect(formatWeekday("2026-10-11")).toBe("domingo");
  });

  it("remove cerca de código", () => {
    expect(stripCodeFence("```html\n<html></html>\n```")).toBe("<html></html>");
  });

  it("cria slug sem acentos", () => {
    expect(makeSlug("João Müller!", 7, "x1y2")).toBe("joao-muller-7-anos-x1y2");
    expect(makeSlug("", null, "x1y2")).toBe("convite-x1y2");
  });
});
