import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import type { PublicInvitation } from "@/lib/invitation";
import { buildPixOrder, isOrderPaid, readPixCharge, verifyWebhookSignature } from "@/lib/mercado-pago";
import { PRICE_CENTS, formatPrice, lastActiveDay, lastDayOf } from "@/lib/pricing";
import { renderInvitation } from "@/lib/render";

describe("preço", () => {
  it("custa R$ 5,00", () => {
    expect(PRICE_CENTS).toBe(500);
    expect(formatPrice(PRICE_CENTS)).toBe("R$ 5,00");
  });
});

describe("último dia no ar", () => {
  const dec1 = new Date("2026-12-01T15:00:00Z");

  it("vai até 7 dias depois da festa", () => {
    expect(lastActiveDay("2026-12-20", dec1)).toBe("2026-12-27");
  });

  it("conta do pagamento quando a festa já passou", () => {
    expect(lastActiveDay("2026-11-20", dec1)).toBe("2026-12-08");
  });

  it("usa o dia do pagamento no horário de Brasília", () => {
    // 01:00 UTC do dia 2 ainda é dia 1 em Brasília.
    expect(lastActiveDay(null, new Date("2026-12-02T01:00:00Z"))).toBe("2026-12-08");
  });
});

describe("último dia gravado no banco", () => {
  it("é o dia anterior ao fim da validade, em Brasília", () => {
    // O banco grava a meia-noite de Brasília do dia seguinte ao último dia.
    expect(lastDayOf("2026-12-28T03:00:00+00:00")).toBe("2026-12-27");
  });
});

describe("marca d'água", () => {
  const invitation: PublicInvitation = {
    id: "1",
    slug: "helena-6-anos-0123456789abcdef",
    status: "draft",
    child_name: "Helena",
    age: 6,
    event_date: "2026-12-12",
    event_time: "16:00",
    rsvp_deadline: null,
    location_name: "Buffet",
    maps_url: null,
    message: "",
    gifts: [],
    image_path: "a.webp",
    html_template: `<!doctype html><html><head></head><body><button data-action="rsvp">Ir</button></body></html>`,
  };
  const options = { artUrl: "https://art.example/a.webp", appOrigin: "https://app.example", pageUrl: "https://app.example/x", nonce: "n" };
  const config = (html: string) =>
    JSON.parse(html.match(/<script id="nv-config"[^>]*>(.*?)<\/script>/)?.[1] ?? "{}") as { mark: string | null; rsvpUrl: string | null };

  it("cobre a prévia do rascunho com PRÉVIA e desliga a confirmação", () => {
    const html = renderInvitation(invitation, { ...options, preview: true, mark: "draft" });
    expect(html).toContain('class="nv-mark"');
    expect(html.match(/PRÉVIA/g)?.length).toBeGreaterThan(20);
    expect(config(html)).toMatchObject({ mark: "draft", rsvpUrl: null });
  });

  it("mostra ENCERRADO no histórico", () => {
    const html = renderInvitation(invitation, { ...options, preview: true, mark: "archived" });
    expect(html).toContain("ENCERRADO");
    expect(config(html).mark).toBe("archived");
  });

  it("não marca o convite publicado", () => {
    const html = renderInvitation({ ...invitation, status: "published" }, options);
    expect(html).not.toContain('class="nv-mark"');
    expect(config(html).mark).toBeNull();
  });
});

describe("order Pix", () => {
  it("pede um Pix de R$ 5,00 ligado à cobrança", () => {
    const body = buildPixOrder({ chargeId: "c-1", amountCents: 500, email: "ana@x.com", description: "Convite da Helena", testPayer: false });
    expect(body).toMatchObject({
      type: "online",
      processing_mode: "automatic",
      external_reference: "c-1",
      total_amount: "5.00",
      payer: { email: "ana@x.com" },
      transactions: { payments: [{ amount: "5.00", payment_method: { id: "pix", type: "bank_transfer" } }] },
    });
    expect(body.payer).not.toHaveProperty("first_name");
  });

  it("usa o pagador APRO nos testes, que é aprovado sozinho", () => {
    const body = buildPixOrder({ chargeId: "c-1", amountCents: 500, email: "ana@x.com", description: "x", testPayer: true });
    expect(body.payer.first_name).toBe("APRO");
  });

  const order = {
    id: "ORD01ABC",
    status: "action_required",
    external_reference: "c-1",
    total_amount: "5.00",
    total_paid_amount: "0.00",
    transactions: {
      payments: [
        {
          id: "PAY01",
          status: "action_required",
          amount: "5.00",
          date_of_expiration: "2026-12-01T16:00:00.000-03:00",
          payment_method: { id: "pix", type: "bank_transfer", qr_code: "00020126pix", qr_code_base64: "iVBORw0KGgo=" },
        },
      ],
    },
  };

  it("lê o QR code e o copia e cola", () => {
    expect(readPixCharge(order)).toEqual({
      orderId: "ORD01ABC",
      pixCode: "00020126pix",
      qrBase64: "iVBORw0KGgo=",
      dueAt: "2026-12-01T19:00:00.000Z",
    });
  });

  it("só considera pago com status processado, valor cheio e a mesma cobrança", () => {
    const paid = { ...order, status: "processed", total_paid_amount: "5.00" };
    expect(isOrderPaid(paid, { chargeId: "c-1", amountCents: 500 })).toBe(true);
    expect(isOrderPaid(order, { chargeId: "c-1", amountCents: 500 })).toBe(false);
    expect(isOrderPaid({ ...paid, external_reference: "outra" }, { chargeId: "c-1", amountCents: 500 })).toBe(false);
    expect(isOrderPaid({ ...paid, total_paid_amount: "0.50" }, { chargeId: "c-1", amountCents: 500 })).toBe(false);
  });
});

describe("assinatura do webhook", () => {
  const secret = "segredo";
  const ts = "1795400000";
  const sign = (manifest: string) => createHmac("sha256", secret).update(manifest).digest("hex");
  const now = Number(ts) * 1000;

  it("aceita a assinatura do Mercado Pago", () => {
    const v1 = sign(`id:ord01abc;request-id:req-1;ts:${ts};`);
    expect(verifyWebhookSignature({ signature: `ts=${ts},v1=${v1}`, requestId: "req-1", dataId: "ORD01ABC", secret, now })).toBe(true);
  });

  it("recusa assinatura errada ou ausente", () => {
    expect(verifyWebhookSignature({ signature: `ts=${ts},v1=abc`, requestId: "req-1", dataId: "ORD01ABC", secret, now })).toBe(false);
    expect(verifyWebhookSignature({ signature: null, requestId: "req-1", dataId: "ORD01ABC", secret, now })).toBe(false);
  });

  it("recusa aviso antigo", () => {
    const v1 = sign(`id:ord01abc;request-id:req-1;ts:${ts};`);
    expect(
      verifyWebhookSignature({ signature: `ts=${ts},v1=${v1}`, requestId: "req-1", dataId: "ORD01ABC", secret, now: now + 10 * 60 * 1000 }),
    ).toBe(false);
  });
});
