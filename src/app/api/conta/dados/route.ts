import { NextResponse } from "next/server";
import { buildDataExport } from "@/lib/data-export";
import { createClient } from "@/lib/supabase/server";

// "Baixar meus dados": /api é público no proxy, então a rota confere a sessão sozinha.
export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return NextResponse.json({ error: "Entre na sua conta para baixar os dados." }, { status: 401 });

  // A RLS já limita as leituras; o filtro por dono evita trazer convites que um admin enxerga.
  const { data: invitations, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at");
  const ids = (invitations ?? []).map((invitation) => invitation.id as string);
  const { data: rsvps, error: rsvpError } = ids.length
    ? await supabase
        .from("rsvps")
        .select("invitation_id, guest_name, party_size, created_at")
        .in("invitation_id", ids)
        .order("created_at")
    : { data: [], error: null };
  if (error || rsvpError) {
    console.error("exportar dados", error ?? rsvpError);
    return NextResponse.json({ error: "Não foi possível montar o arquivo. Tente de novo." }, { status: 500 });
  }

  const file = buildDataExport({
    account: { email: user.email ?? "", created_at: user.created_at },
    invitations: invitations ?? [],
    rsvps: rsvps ?? [],
    exportedAt: new Date(),
  });

  return new NextResponse(JSON.stringify(file, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="meus-dados-niver.json"',
      "Cache-Control": "private, no-store",
    },
  });
}
