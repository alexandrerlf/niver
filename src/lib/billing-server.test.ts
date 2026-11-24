import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Charge } from "@/lib/billing-server";

// Banco falso em memória: guarda as cobranças e conta quantas vezes o convite foi publicado.
const db = vi.hoisted(() => ({ charges: [] as Record<string, unknown>[], published: [] as string[] }));

vi.mock("@/lib/supabase/service", () => {
  const table = () => {
    const filters: [string, unknown][] = [];
    let patch: Record<string, unknown> | null = null;
    const rows = () => db.charges.filter((row) => filters.every(([key, value]) => row[key] === value));
    const query = {
      select: () => query,
      update: (values: Record<string, unknown>) => ((patch = values), query),
      eq: (key: string, value: unknown) => {
        filters.push([key, value]);
        return query;
      },
      maybeSingle: async () => ({ data: rows()[0] ?? null, error: null }),
      then: (resolve: (value: { error: null }) => void) => {
        if (patch) rows().forEach((row) => Object.assign(row, patch));
        resolve({ error: null });
      },
    };
    return query;
  };
  const client = {
    from: () => table(),
    rpc: async (_: string, { p_charge_id }: { p_charge_id: string }) => {
      const charge = db.charges.find((row) => row.id === p_charge_id)!;
      if (charge.status !== "paid") {
        charge.status = "paid";
        db.published.push(p_charge_id);
      }
      return { error: null };
    },
  };
  return { createServiceClient: () => client };
});

const { settleCharge } = await import("@/lib/billing-server");
const { createServiceClient } = await import("@/lib/supabase/service");
const { POST } = await import("@/app/api/pagamentos/webhook/route");

const charge = (extra: Partial<Charge> = {}): Charge => ({
  id: "c-1",
  invitation_id: "i-1",
  owner_id: "u-1",
  kind: "pix",
  amount_cents: 500,
  status: "pending",
  mp_order_id: "ORD01ABC",
  pix_code: "000201",
  pix_qr_base64: "iVBOR",
  due_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  paid_at: null,
  ...extra,
});

let orderStatus = "action_required";
let paidAmount = "0.00";

beforeEach(() => {
  db.charges = [charge() as unknown as Record<string, unknown>];
  db.published = [];
  orderStatus = "action_required";
  paidAmount = "0.00";
  vi.stubEnv("MERCADOPAGO_ACCESS_TOKEN", "TEST-token");
  vi.stubEnv("MERCADOPAGO_WEBHOOK_SECRET", "segredo");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({ id: "ORD01ABC", status: orderStatus, external_reference: "c-1", total_paid_amount: paidAmount }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const service = () => createServiceClient();
const current = () => db.charges[0] as unknown as Charge;

describe("conferir cobrança", () => {
  it("deixa pendente enquanto o Pix não cai", async () => {
    expect(await settleCharge(service(), current())).toBe("pending");
    expect(db.published).toEqual([]);
  });

  it("publica quando o Mercado Pago confirma o pagamento", async () => {
    orderStatus = "processed";
    paidAmount = "5.00";
    expect(await settleCharge(service(), current())).toBe("paid");
    expect(db.published).toEqual(["c-1"]);
  });

  it("marca como vencida a cobrança que passou do prazo sem pagamento", async () => {
    db.charges = [charge({ due_at: new Date(Date.now() - 1000).toISOString() }) as unknown as Record<string, unknown>];
    expect(await settleCharge(service(), current())).toBe("expired");
    expect(current().status).toBe("expired");
  });
});

describe("webhook do Mercado Pago", () => {
  const notify = (signed: boolean) => {
    const ts = Math.floor(Date.now() / 1000).toString();
    const v1 = createHmac("sha256", "segredo").update(`id:ord01abc;request-id:req-1;ts:${ts};`).digest("hex");
    return POST(
      new Request("https://niver.example/api/pagamentos/webhook?data.id=ORD01ABC&type=order", {
        method: "POST",
        headers: signed ? { "x-signature": `ts=${ts},v1=${v1}`, "x-request-id": "req-1" } : {},
        body: JSON.stringify({ type: "order", data: { id: "ORD01ABC" } }),
      }),
    );
  };

  it("recusa aviso sem assinatura e não publica", async () => {
    orderStatus = "processed";
    paidAmount = "5.00";
    expect((await notify(false)).status).toBe(401);
    expect(db.published).toEqual([]);
  });

  it("publica uma vez só, mesmo com aviso repetido", async () => {
    orderStatus = "processed";
    paidAmount = "5.00";
    expect((await notify(true)).status).toBe(200);
    expect((await notify(true)).status).toBe(200);
    expect(db.published).toEqual(["c-1"]);
  });
});
