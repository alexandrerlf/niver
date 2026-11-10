import { notFound } from "next/navigation";
import { saveTemplateArt, setTemplateStatus } from "@/app/admin-actions";
import { ActionButton } from "@/components/action-button";
import { ArtUpload } from "@/components/art-upload";
import { BackLink } from "@/components/back-link";
import { Icon } from "@/components/icons";
import { TemplateForm } from "@/components/template-form";
import { templateProblems } from "@/lib/render";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS, type Template, type TemplateStatus } from "@/lib/template";

const BADGES: Record<TemplateStatus, string> = {
  draft: "bg-sun/25 text-ink",
  published: "bg-leaf/12 text-leaf",
  archived: "bg-sunken text-muted",
};

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("templates").select("*").eq("id", id).maybeSingle();
  const template = data as Template | null;
  if (!template) notFound();

  const { data: accessData } = await supabase
    .from("template_access")
    .select("email")
    .eq("template_id", id)
    .order("email");
  const emails = (accessData ?? []).map((row) => row.email as string);
  const problems = templateProblems(template.html);

  return (
    <main>
      <div className="mb-8 animate-rise sm:mb-10">
        <BackLink href="/admin/modelos">Modelos</BackLink>
        <div className="mt-4">
          <span className={`badge ${BADGES[template.status]}`}>
            <span className={`badge-dot ${template.status === "draft" ? "text-sun" : ""}`} />
            {STATUS_LABELS[template.status]}
          </span>
        </div>
        <h1 className="page-title mt-3 break-words">{template.name}</h1>
      </div>

      <section className="grid animate-rise items-start gap-8 lg:grid-cols-[290px_1fr] lg:gap-12">
        <figure className="lg:sticky lg:top-24">
          <div className="phone">
            {template.art_path ? (
              <iframe
                key={template.updated_at}
                src={`/previa/modelo/${template.id}`}
                title="Prévia do modelo com dados de exemplo"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex! flex-col items-center justify-center gap-3 bg-sunken! p-6 text-center font-semibold text-muted">
                <Icon name="image" className="size-8" />
                Envie a arte para ver a prévia
              </div>
            )}
          </div>
          <figcaption className="mt-4 text-center text-sm text-muted">Prévia com dados de exemplo</figcaption>
        </figure>

        <div className="min-w-0 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="panel">
              <h2 className="section-title">Arte</h2>
              <p className="mt-1 mb-5 text-sm text-muted">
                JPG, PNG ou WebP, até 8 MB. Sem nome, data ou local escritos.
              </p>
              <ArtUpload
                folder={`templates/${template.id}`}
                save={saveTemplateArt.bind(null, template.id)}
                label={template.art_path ? "Trocar arte" : "Enviar arte"}
              />
            </div>
            <div className="panel">
              <h2 className="section-title">Publicação</h2>
              <p className="mt-1 mb-5 text-sm text-muted">
                Convites já criados guardam uma cópia e não mudam quando o modelo é editado.
              </p>
              {template.status === "published" ? (
                <ActionButton
                  action={setTemplateStatus.bind(null, template.id, "archived")}
                  label="Arquivar modelo"
                  pendingLabel="Arquivando..."
                  className="button-secondary"
                />
              ) : (
                <ActionButton
                  action={setTemplateStatus.bind(null, template.id, "published")}
                  label="Publicar para clientes"
                  pendingLabel="Publicando..."
                  icon={<Icon name="sparkles" className="size-[18px]" />}
                />
              )}
            </div>
          </div>

          {problems.length > 0 && (
            <div role="alert" className="rounded-3xl border border-danger/25 bg-danger/8 p-5 text-danger sm:p-6">
              <p className="flex items-center gap-2 font-bold">
                <Icon name="alert" />
                Antes de publicar, ajuste o HTML
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-9 text-sm font-medium">
                {problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="panel">
            <h2 className="section-title mb-6">Configuração</h2>
            <TemplateForm template={template} emails={emails} />
          </div>
        </div>
      </section>
    </main>
  );
}
