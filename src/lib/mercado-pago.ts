import { createHmac, timingSafeEqual } from "node:crypto";

// Formato da API de Orders do Mercado Pago (POST e GET /v1/orders), só com o que o Niver usa.
export type MpOrder = {
  id?: string;
  status?: string;
  external_reference?: string;
  total_amount?: string;
  total_paid_amount?: string;
  transactions?: {
    payments?: {
      id?: string;
      status?: string;
      amount?: string;
      paid_amount?: string;
      date_of_expiration?: string;
      payment_method?: { id?: string; type?: string; qr_code?: string; qr_code_base64?: string };
    }[];
  };
};

const toAmount = (cents: number) => (cents / 100).toFixed(2);
const toCents = (amount: string | undefined) => Math.round(Number(amount ?? "0") * 100);

export function buildPixOrder({
  chargeId,
  amountCents,
  email,
  description,
  testPayer,
}: {
  chargeId: string;
  amountCents: number;
  email: string;
  description: string;
  // Nas credenciais de teste, o pagador "APRO" tem o Pix aprovado automaticamente.
  testPayer: boolean;
}) {
  const amount = toAmount(amountCents);
  return {
    type: "online",
    processing_mode: "automatic",
    external_reference: chargeId,
    total_amount: amount,
    description,
    payer: testPayer ? { email, first_name: "APRO" } : { email },
    transactions: {
      payments: [{ amount, payment_method: { id: "pix", type: "bank_transfer" }, expiration_time: "PT1H" }],
    },
  };
}

export function readPixCharge(order: MpOrder) {
  const payment = order.transactions?.payments?.[0];
  const method = payment?.payment_method;
  if (!order.id || !method?.qr_code || !method.qr_code_base64) return null;
  return {
    orderId: order.id,
    pixCode: method.qr_code,
    qrBase64: method.qr_code_base64,
    dueAt: payment?.date_of_expiration ? new Date(payment.date_of_expiration).toISOString() : null,
  };
}

// Pago de verdade: order processada, da mesma cobrança e com o valor cheio recebido.
export function isOrderPaid(order: MpOrder, charge: { chargeId: string; amountCents: number }) {
  return (
    order.status === "processed" &&
    order.external_reference === charge.chargeId &&
    toCents(order.total_paid_amount) >= charge.amountCents
  );
}

// Assinatura `x-signature` dos avisos do Mercado Pago: HMAC-SHA256 de "id:<data.id>;request-id:<x-request-id>;ts:<ts>;".
export function verifyWebhookSignature({
  signature,
  requestId,
  dataId,
  secret,
  now = Date.now(),
  toleranceSeconds = 300,
}: {
  signature: string | null;
  requestId: string | null;
  dataId: string | null;
  secret: string;
  now?: number;
  toleranceSeconds?: number;
}) {
  if (!signature || !secret) return false;
  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const index = part.indexOf("=");
      return [part.slice(0, index).trim().toLowerCase(), part.slice(index + 1).trim()];
    }),
  );
  const { ts, v1 } = parts;
  if (!ts || !/^\d+$/.test(ts) || !v1) return false;
  if (Math.abs(now - Number(ts) * 1000) / 1000 > toleranceSeconds) return false;

  // O Mercado Pago assina o id em minúsculas quando ele tem letras.
  const manifest = [dataId && `id:${dataId.toLowerCase()}`, requestId && `request-id:${requestId}`, `ts:${ts}`]
    .filter(Boolean)
    .join(";") + ";";
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  return expected.length === v1.length && timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}
