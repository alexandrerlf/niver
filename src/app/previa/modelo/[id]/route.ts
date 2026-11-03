import { ART_BUCKET } from "@/lib/invitation";
import { invitationResponse, notFoundResponse } from "@/lib/invitation-response";
import { createClient } from "@/lib/supabase/server";
import { sampleInvitation, type Template } from "@/lib/template";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select("id, html, art_path")
    .eq("id", id)
    .maybeSingle();
  const template = data as Pick<Template, "id" | "html" | "art_path"> | null;

  if (!template?.art_path || !template.html) {
    return notFoundResponse("Envie a arte e o HTML para ver a prévia.");
  }

  const artUrl = supabase.storage.from(ART_BUCKET).getPublicUrl(template.art_path).data.publicUrl;
  return invitationResponse(sampleInvitation(template), artUrl, request, true);
}
