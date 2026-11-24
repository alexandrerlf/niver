import type { MpOrder } from "@/lib/mercado-pago";

// Chamadas à API de Orders do Mercado Pago, só no servidor.
const API = "https://api.mercadopago.com";

async function call(path: string, init: RequestInit = {}) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado.");
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Mercado Pago respondeu ${response.status}: ${(await response.text()).slice(0, 500)}`);
  }
  return (await response.json()) as MpOrder;
}

export function createOrder(body: object, idempotencyKey: string) {
  return call("/v1/orders", { method: "POST", body: JSON.stringify(body), headers: { "X-Idempotency-Key": idempotencyKey } });
}

export function getOrder(id: string) {
  return call(`/v1/orders/${encodeURIComponent(id)}`);
}
