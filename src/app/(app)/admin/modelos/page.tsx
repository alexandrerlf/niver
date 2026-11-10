import type { Metadata } from "next";
import { ArtCard, EmptyState, type Tone } from "@/components/art-card";
import { Icon } from "@/components/icons";
import { NewTemplateForm } from "@/components/new-template-form";
import { ART_BUCKET } from "@/lib/invitation";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS, type Template, type TemplateStatus } from "@/lib/template";

export const metadata: Metadata = { title: "Modelos" };

type Row = Pick<Template, "id" | "name" | "status" | "visibility" | "art_path">;

const TONES: Record<TemplateStatus, Tone> = { draft: "sun", published: "leaf", archived: "muted" };

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select("id, name, status, visibility, art_path")
    .order("created_at", { ascending: false });
  const templates = (data ?? []) as Row[];

  return (
    <main>
      <div className="mb-8 animate-rise sm:mb-10">
        <p className="eyebrow">Admin</p>
        <h1 className="page-title mt-2">Modelos</h1>
        <p className="mt-3 text-lg text-muted">O catálogo que os clientes usam para criar convites.</p>
      </div>

      <section className="panel mb-8 animate-rise">
        <NewTemplateForm />
      </section>

      {templates.length === 0 ? (
        <EmptyState icon={<Icon name="grid" className="size-8" />} title="Nenhum modelo ainda">
          Dê um nome ao primeiro modelo acima. Depois é só enviar a arte e colar o HTML.
        </EmptyState>
      ) : (
        <ul className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {templates.map((template) => (
            <li key={template.id}>
              <ArtCard
                href={`/admin/modelos/${template.id}`}
                imageUrl={
                  template.art_path
                    ? supabase.storage.from(ART_BUCKET).getPublicUrl(template.art_path).data.publicUrl
                    : null
                }
                title={template.name}
                subtitle={template.visibility === "selected" ? "Liberado por e-mail" : "Todos os clientes"}
                badge={{ label: STATUS_LABELS[template.status], tone: TONES[template.status] }}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
