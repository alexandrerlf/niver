import { ART_BUCKET, PUBLIC_COLUMNS, type PublicInvitation } from "@/lib/invitation";
import { closedResponse, invitationResponse, notFoundResponse } from "@/lib/invitation-response";
import { createGuestClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// O visitante só lê convites no ar. Para dizer "encerrado" em vez de "não encontrado",
// o servidor confere só a situação do convite, sem expor os dados da festa.
async function wasPublished(slug: string) {
  try {
    const { data } = await createServiceClient()
      .from("invitations")
      .select("status, paid_at")
      .eq("slug", slug)
      .maybeSingle();
    return Boolean(data && data.paid_at && data.status !== "draft");
  } catch (error) {
    console.error("wasPublished", error);
    return false;
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createGuestClient();
  const { data } = await supabase
    .from("invitations")
    .select(PUBLIC_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  const invitation = data as PublicInvitation | null;

  if (!invitation?.html_template || !invitation.image_path) {
    if (!invitation && (await wasPublished(slug))) return closedResponse();
    return notFoundResponse("Convite não encontrado.");
  }

  const artUrl = supabase.storage.from(ART_BUCKET).getPublicUrl(invitation.image_path).data.publicUrl;
  return invitationResponse(invitation, artUrl, request);
}
