import { NextResponse } from "next/server";
import { type Charge, settleCharge } from "@/lib/billing-server";
import { verifyWebhookSignature } from "@/lib/mercado-pago";
import { createServiceClient } from "@/lib/supabase/service";

// Aviso do Mercado Pago sobre uma order. Não confia no corpo: confere a assinatura e
// busca a order na API antes de publicar qualquer coisa.
export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => null)) as { type?: string; data?: { id?: string } } | null;
  const orderId = url.searchParams.get("data.id") ?? body?.data?.id ?? null;

  const valid = verifyWebhookSignature({
    signature: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId: orderId,
    secret: process.env.MERCADOPAGO_WEBHOOK_SECRET ?? "",
  });
  if (!valid) return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  if (!orderId) return NextResponse.json({ ok: true });

  const service = createServiceClient();
  const { data } = await service.from("charges").select("*").eq("mp_order_id", orderId).maybeSingle();
  // Order que não é de uma cobrança do Niver: nada a fazer, mas responde 200 para o Mercado Pago não insistir.
  if (!data) return NextResponse.json({ ok: true });

  try {
    const status = await settleCharge(service, data as Charge);
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error("webhook Mercado Pago", error);
    // 500 faz o Mercado Pago tentar de novo mais tarde.
    return NextResponse.json({ error: "Tente de novo." }, { status: 500 });
  }
}
