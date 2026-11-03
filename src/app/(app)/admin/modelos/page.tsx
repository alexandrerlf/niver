import Link from "next/link";
import { NewTemplateForm } from "@/components/new-template-form";
import { ART_BUCKET } from "@/lib/invitation";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS, type Template } from "@/lib/template";

type Row = Pick<Template, "id" | "name" | "status" | "visibility" | "art_path">;

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select("id, name, status, visibility, art_path")
    .order("created_at", { ascending: false });
  const templates = (data ?? []) as Row[];

  return (
    <main className="space-y-5">
      <h1 className="font-display text-3xl font-bold">Modelos</h1>

      <section className="panel">
        <NewTemplateForm />
      </section>

      {templates.length === 0 ? (
        <div className="panel text-center">
          <p className="font-display text-xl font-bold">Nenhum modelo ainda</p>
          <p className="mt-1 text-muted">Crie o primeiro acima.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {templates.map((template) => (
            <li key={template.id}>
              <Link
                href={`/admin/modelos/${template.id}`}
                className="block overflow-hidden rounded-2xl border border-line bg-card"
              >
                {template.art_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={supabase.storage.from(ART_BUCKET).getPublicUrl(template.art_path).data.publicUrl}
                    alt=""
                    className="aspect-[9/14] w-full object-cover object-top"
                  />
                ) : (
                  <div className="aspect-[9/14] bg-sun/40" />
                )}
                <div className="p-3">
                  <p className="truncate font-bold">{template.name}</p>
                  <p className="truncate text-sm text-muted">
                    {STATUS_LABELS[template.status]}
                    {template.visibility === "selected" ? " · por e-mail" : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
