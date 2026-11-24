import { isOrderPaid } from "@/lib/mercado-pago";
import { getOrder } from "@/lib/mercado-pago-api";
import type { ServiceClient } from "@/lib/supabase/service";

export type ChargeStatus = "pending" | "paid" | "expired" | "failed";

export type Charge = {
  id: string;
  invitation_id: string;
  owner_id: string;
  kind: "pix" | "cortesia" | "transicao";
  amount_cents: number;
  status: ChargeStatus;
  mp_order_id: string | null;
  pix_code: string | null;
  pix_qr_base64: string | null;
  due_at: string | null;
  paid_at: string | null;
};

// Confere no Mercado Pago uma cobrança em aberto e publica o convite se o pagamento caiu.
// Serve ao webhook e à tela de pagamento, que pergunta de tempos em tempos caso o aviso atrase.
export async function settleCharge(service: ServiceClient, charge: Charge): Promise<ChargeStatus> {
  if (charge.status !== "pending" || !charge.mp_order_id) return charge.status;

  const order = await getOrder(charge.mp_order_id);
  if (isOrderPaid(order, { chargeId: charge.id, amountCents: charge.amount_cents })) {
    const { error } = await service.rpc("publish_invitation", { p_charge_id: charge.id });
    if (error) throw new Error(`publish_invitation: ${error.message}`);
    return "paid";
  }

  if (charge.due_at && Date.parse(charge.due_at) < Date.now()) {
    await service.from("charges").update({ status: "expired" }).eq("id", charge.id).eq("status", "pending");
    return "expired";
  }
  return "pending";
}
