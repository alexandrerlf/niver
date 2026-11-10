import type { Metadata } from "next";
import { ArtCard, EmptyState } from "@/components/art-card";
import { Icon } from "@/components/icons";
import { Stepper } from "@/components/stepper";
import { ART_BUCKET } from "@/lib/invitation";
import { createClient } from "@/lib/supabase/server";
import type { Template } from "@/lib/template";

export const metadata: Metadata = { title: "Novo convite" };

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
      <div className="mb-8 animate-rise sm:mb-10">
        <Stepper current={0} />
        <h1 className="page-title mt-5">Escolha um modelo</h1>
        <p className="mt-3 text-lg text-muted">Depois é só preencher os dados da festa.</p>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={<Icon name={allowed === true ? "image" : "mail"} className="size-8" />}
          title={allowed === true ? "Nenhum modelo liberado ainda" : "Sua conta ainda não está autorizada"}
        >
          {allowed === true
            ? "Peça o tema que você quer. Ele aparece aqui assim que for liberado."
            : "Peça a liberação do seu e-mail para criar convites."}
        </EmptyState>
      ) : (
        <ul className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {templates.map((template) => (
            <li key={template.id}>
              <ArtCard
                href={`/novo/${template.id}`}
                imageUrl={
                  template.art_path
                    ? supabase.storage.from(ART_BUCKET).getPublicUrl(template.art_path).data.publicUrl
                    : null
                }
                title={template.name}
                subtitle="Usar este modelo"
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
