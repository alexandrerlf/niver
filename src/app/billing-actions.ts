"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type Charge, settleCharge } from "@/lib/billing-server";
import { hasEventDetails, type Invitation } from "@/lib/invitation";
import { buildPixOrder, readPixCharge } from "@/lib/mercado-pago";
import { createOrder } from "@/lib/mercado-pago-api";
import { PRICE_CENTS } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export type PixCharge = {
  id: string;
  status: Charge["status"];
  pixCode: string;
  qrBase64: string;
  dueAt: string | null;
};

type PixResult = { charge: PixCharge } | { error: string };

const toView = (charge: Charge): PixCharge => ({
  id: charge.id,
  status: charge.status,
  pixCode: charge.pix_code ?? "",
  qrBase64: charge.pix_qr_base64 ?? "",
  dueAt: charge.due_at,
});

// Pode ir ao ar: rascunho, arquivado, ou publicado que já venceu e espera o arquivamento.
function canPublish(invitation: Invitation) {
  if (invitation.status === "draft" || invitation.status === "archived") return true;
  return !invitation.expires_at || Date.parse(invitation.expires_at) <= Date.now();
}

async function ownInvitation(invitationId: string) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims.sub;
  if (!userId) redirect("/login");
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", invitationId)
    .eq("owner_id", userId)
    .maybeSingle();
  return {
    supabase,
    userId,
    email: typeof auth?.claims.email === "string" ? auth.claims.email : "",
    invitation: data as Invitation | null,
  };
}

// Gera o Pix para publicar ou reativar o convite. Uma cobrança em aberto é reaproveitada.
export async function requestPixCharge(invitationId: string): Promise<PixResult> {
  const { userId, email, invitation } = await ownInvitation(invitationId);
  if (!invitation) return { error: "Convite não encontrado." };
  if (!hasEventDetails(invitation) || !invitation.html_template || !invitation.image_path) {
    return { error: "Preencha nome, data, horário e local antes de publicar." };
  }
  if (!canPublish(invitation)) return { error: "Este convite já está no ar." };
  if (!email) return { error: "Sua conta precisa de um e-mail para gerar o Pix." };

  const service = createServiceClient();
  const { data: open } = await service
    .from("charges")
    .select("*")
    .eq("invitation_id", invitationId)
    .eq("kind", "pix")
    .eq("status", "pending")
    .not("mp_order_id", "is", null)
    .gt("due_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (open) return { charge: toView(open as Charge) };

  const { data: created, error: insertError } = await service
    .from("charges")
    .insert({ invitation_id: invitationId, owner_id: userId, kind: "pix", amount_cents: PRICE_CENTS })
    .select("*")
    .single();
  if (insertError || !created) {
    console.error("requestPixCharge insert", insertError);
    return { error: "Não foi possível gerar o Pix. Tente de novo." };
  }

  try {
    const order = await createOrder(
      buildPixOrder({
        chargeId: created.id,
        amountCents: PRICE_CENTS,
        email,
        description: `Convite Niver: ${invitation.child_name}`.slice(0, 120),
        // Com credenciais de teste, o pagador "APRO" tem o Pix aprovado sozinho.
        testPayer: process.env.MERCADOPAGO_TEST_PAYER === "1" || process.env.VERCEL_ENV !== "production",
      }),
      created.id,
    );
    const pix = readPixCharge(order);
    if (!pix) throw new Error(`Order ${order.id} sem QR code do Pix.`);

    const { data: saved, error } = await service
      .from("charges")
      .update({ mp_order_id: pix.orderId, pix_code: pix.pixCode, pix_qr_base64: pix.qrBase64, due_at: pix.dueAt })
      .eq("id", created.id)
      .select("*")
      .single();
    if (error || !saved) throw new Error(`Salvar cobrança: ${error?.message}`);
    return { charge: toView(saved as Charge) };
  } catch (error) {
    console.error("requestPixCharge", error);
    await service.from("charges").update({ status: "failed" }).eq("id", created.id);
    return { error: "Não foi possível gerar o Pix agora. Tente de novo em instantes." };
  }
}

// A tela de pagamento pergunta pela cobrança; se o aviso do Mercado Pago atrasou, o servidor confere.
export async function checkPixCharge(chargeId: string): Promise<{ status: Charge["status"] }> {
  const supabase = await createClient();
  // A RLS só devolve cobranças do próprio dono.
  const { data } = await supabase.from("charges").select("*").eq("id", chargeId).maybeSingle();
  const charge = data as Charge | null;
  if (!charge) return { status: "failed" };

  try {
    // Sem revalidatePath: a tela mostra a confirmação e só depois recarrega o convite no ar.
    return { status: await settleCharge(createServiceClient(), charge) };
  } catch (error) {
    console.error("checkPixCharge", error);
    return { status: charge.status };
  }
}

// Cortesia: o admin coloca o convite no ar sem cobrança.
export async function publishCourtesy(invitationId: string): Promise<{ error?: string; notice?: string }> {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) return { error: "Só o admin publica sem cobrar." };

  const service = createServiceClient();
  const { data } = await service.from("invitations").select("*").eq("id", invitationId).maybeSingle();
  const invitation = data as Invitation | null;
  if (!invitation) return { error: "Convite não encontrado." };
  if (!hasEventDetails(invitation)) return { error: "Preencha nome, data, horário e local antes de publicar." };
  if (!canPublish(invitation)) return { error: "Este convite já está no ar." };

  const { data: charge, error } = await service
    .from("charges")
    .insert({ invitation_id: invitationId, owner_id: invitation.owner_id, kind: "cortesia", amount_cents: 0 })
    .select("id")
    .single();
  if (error || !charge) return { error: "Não foi possível publicar. Tente de novo." };

  const { error: publishError } = await service.rpc("publish_invitation", { p_charge_id: charge.id });
  if (publishError) {
    console.error("publishCourtesy", publishError);
    return { error: "Não foi possível publicar. Tente de novo." };
  }
  revalidatePath(`/convites/${invitationId}`);
  return { notice: "Convite publicado sem cobrança." };
}
