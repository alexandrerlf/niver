import { ART_BUCKET, PUBLIC_COLUMNS, type PublicInvitation } from "@/lib/invitation";
import { invitationResponse, notFoundResponse } from "@/lib/invitation-response";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("invitations").select(PUBLIC_COLUMNS).eq("id", id).maybeSingle();
  const invitation = data as PublicInvitation | null;

  if (!invitation?.html_template || !invitation.image_path) {
    return notFoundResponse("Convite não encontrado.");
  }

  const artUrl = supabase.storage.from(ART_BUCKET).getPublicUrl(invitation.image_path).data.publicUrl;
  return invitationResponse(invitation, artUrl, request, true);
}
