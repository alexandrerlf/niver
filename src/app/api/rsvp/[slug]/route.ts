import { NextResponse } from "next/server";
import { z } from "zod";
import { createGuestClient } from "@/lib/supabase/server";

// O convite roda com origem opaca ("null"), então a rota precisa aceitar CORS.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(120),
  partySize: z.number().int().min(1).max(20),
});

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = rsvpSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400, headers: CORS });
  }

  const supabase = createGuestClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!invitation) {
    return NextResponse.json({ error: "Convite não encontrado." }, { status: 404, headers: CORS });
  }

  const { error } = await supabase.from("rsvps").insert({
    invitation_id: invitation.id,
    guest_name: parsed.data.name,
    party_size: parsed.data.partySize,
  });
  if (error) {
    console.error("rsvp", error);
    return NextResponse.json({ error: "Tente de novo." }, { status: 500, headers: CORS });
  }
  return NextResponse.json({ ok: true }, { status: 201, headers: CORS });
}
