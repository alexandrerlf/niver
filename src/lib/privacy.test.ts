import { describe, expect, it } from "vitest";
import { makeSlug, parseNewDetails, type PublicInvitation } from "@/lib/invitation";
import { invitationResponse } from "@/lib/invitation-response";
import { renderInvitation } from "@/lib/render";
import { slugCode } from "@/lib/slug-code";

const details = {
  child_name: "Helena",
  age: "6",
  event_date: "2026-12-12",
  event_time: "16:00",
  location_name: "Buffet Alegria",
  rsvp_deadline: "",
};

function form(extra: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ ...details, ...extra })) data.set(key, value);
  return data;
}

const invitation: PublicInvitation = {
  id: "1",
  slug: "helena-6-anos-0123456789abcdef",
  status: "published",
  child_name: "Helena",
  age: 6,
  event_date: "2026-12-12",
  event_time: "16:00",
  rsvp_deadline: null,
  location_name: "Buffet Alegria",
  maps_url: null,
  message: "",
  gifts: [],
  image_path: "a.webp",
  html_template: `<!doctype html><html><head></head><body><button data-action="rsvp">Ir</button></body></html>`,
};

describe("consentimento do responsável na criação", () => {
  it("recusa criar o convite sem a confirmação", () => {
    const parsed = parseNewDetails(form());
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0]?.message).toBe("Confirme que você é responsável pela criança para continuar.");
  });

  it("aceita quando a caixa vem marcada", () => {
    const parsed = parseNewDetails(form({ guardian_consent: "on" }));
    expect(parsed.success).toBe(true);
    expect(parsed.data).not.toHaveProperty("guardian_consent");
  });
});

describe("código aleatório do link", () => {
  it("tem 16 caracteres hexadecimais (64 bits)", () => {
    expect(slugCode()).toMatch(/^[0-9a-f]{16}$/);
  });

  it("muda a cada convite", () => {
    expect(slugCode()).not.toBe(slugCode());
  });

  it("cabe no limite do banco mesmo com nome longo", () => {
    const slug = makeSlug("a".repeat(120), 120, slugCode());
    expect(slug).toMatch(/^[a-z0-9-]{3,80}$/);
    expect(makeSlug("Helena", 6, "0123456789abcdef")).toBe("helena-6-anos-0123456789abcdef");
  });
});

describe("convite fora dos buscadores", () => {
  it("pede para não indexar nem seguir links", () => {
    const response = invitationResponse(invitation, "https://art.example/a.webp", new Request("https://app.example/c/x"));
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });
});

describe("aviso ao convidado", () => {
  const html = renderInvitation(invitation, {
    artUrl: "https://art.example/a.webp",
    appOrigin: "https://app.example",
    pageUrl: "https://app.example/c/x",
    nonce: "n",
  });

  it("explica para quem vão os dados e liga para a política em outra aba", () => {
    expect(html).toContain("Seu nome e o número de pessoas vão para quem enviou o convite.");
    expect(html).toMatch(/<a [^>]*href="https:\/\/app\.example\/privacidade"[^>]*target="_blank"[^>]*>Política de Privacidade<\/a>/);
  });
});
