import Link from "next/link";
import { ART_BUCKET } from "@/lib/invitation";
import { createClient } from "@/lib/supabase/server";
import type { Template } from "@/lib/template";

type Row = Pick<Template, "id" | "name" | "art_path">;

export default async function NewInvitationPage() {
  const supabase = await createClient();
  const { data: allowed } = await supabase.rpc("can_create_invitations");
  const { data } = await supabase
    .from("templates")
    .select("id, name, art_path")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  const templates = (data ?? []) as Row[];

  return (
    <main>
      <h1 className="font-display text-3xl font-bold">Escolha um modelo</h1>
      <p className="mt-1 mb-5 text-muted">Depois é só preencher os dados da festa.</p>

      {templates.length === 0 ? (
        <div className="panel text-center">
          <p className="font-display text-xl font-bold">
            {allowed === true ? "Nenhum modelo liberado ainda" : "Sua conta ainda não está autorizada"}
          </p>
          <p className="mt-1 text-muted">
            {allowed === true
              ? "Peça o tema que você quer. Ele aparece aqui assim que for liberado."
              : "Peça a liberação do seu e-mail para criar convites."}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {templates.map((template) => (
            <li key={template.id}>
              <Link
                href={`/novo/${template.id}`}
                className="block overflow-hidden rounded-2xl border border-line bg-card"
              >
                {template.art_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={supabase.storage.from(ART_BUCKET).getPublicUrl(template.art_path).data.publicUrl}
                    alt=""
                    className="aspect-[9/14] w-full object-cover object-top"
                  />
                )}
                <div className="p-3">
                  <p className="truncate font-bold">{template.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
