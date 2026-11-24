import { ART_BUCKET, PUBLIC_COLUMNS, type PublicInvitation } from "@/lib/invitation";
import { invitationResponse, notFoundResponse } from "@/lib/invitation-response";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select(`${PUBLIC_COLUMNS}, expires_at`)
    .eq("id", id)
    .maybeSingle();
  const invitation = data as (PublicInvitation & { expires_at: string | null }) | null;

  if (!invitation?.html_template || !invitation.image_path) {
    return notFoundResponse("Convite não encontrado.");
  }

  const artUrl = supabase.storage.from(ART_BUCKET).getPublicUrl(invitation.image_path).data.publicUrl;
  // Sem pagamento, a prévia sai com PRÉVIA; depois da validade, com ENCERRADO.
  const expired = invitation.status === "archived" || (invitation.expires_at !== null && Date.parse(invitation.expires_at) <= Date.now());
  const mark = invitation.status === "draft" ? "draft" : expired ? "archived" : null;
  return invitationResponse(invitation, artUrl, request, true, mark);
}
