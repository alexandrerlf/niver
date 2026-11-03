import { notFound } from "next/navigation";
import { saveTemplateArt, setTemplateStatus } from "@/app/admin-actions";
import { ActionButton } from "@/components/action-button";
import { ArtUpload } from "@/components/art-upload";
import { TemplateForm } from "@/components/template-form";
import { templateProblems } from "@/lib/render";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS, type Template } from "@/lib/template";

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
    <main className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">{template.name}</h1>
        <p className="text-muted">{STATUS_LABELS[template.status]}</p>
      </div>

      <section className="grid gap-5 sm:grid-cols-[280px_1fr]">
        {template.art_path ? (
          <iframe
            key={template.updated_at}
            src={`/previa/modelo/${template.id}`}
            title="Prévia do modelo com dados de exemplo"
            sandbox="allow-scripts"
            className="mx-auto aspect-[9/16] w-full max-w-[280px] rounded-2xl border border-line bg-white"
          />
        ) : (
          <div className="mx-auto flex aspect-[9/16] w-full max-w-[280px] items-center justify-center rounded-2xl border border-line bg-sun/40 p-4 text-center font-bold">
            Envie a arte para ver a prévia
          </div>
        )}
        <div className="space-y-5">
          <div className="panel">
            <h2 className="font-display text-xl font-bold">Arte</h2>
            <p className="mb-4 text-sm text-muted">JPG, PNG ou WebP, até 8 MB.</p>
            <ArtUpload
              folder={`templates/${template.id}`}
              save={saveTemplateArt.bind(null, template.id)}
              label={template.art_path ? "Trocar arte" : "Enviar arte"}
            />
          </div>
          <div className="panel">
            <h2 className="font-display text-xl font-bold">Publicação</h2>
            {problems.length > 0 && (
              <div className="mt-2 text-sm font-semibold text-danger">
                <p>Antes de publicar, ajuste o HTML:</p>
                <ul className="list-disc pl-5">
                  {problems.map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-2 mb-4 text-sm text-muted">
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
              />
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <TemplateForm template={template} emails={emails} />
      </section>
    </main>
  );
}
