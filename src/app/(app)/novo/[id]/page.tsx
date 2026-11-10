import { notFound } from "next/navigation";
import { createInvitation } from "@/app/actions";
import { BackLink } from "@/components/back-link";
import { DetailsForm } from "@/components/details-form";
import { Stepper } from "@/components/stepper";
import { createClient } from "@/lib/supabase/server";
import type { Template } from "@/lib/template";

export default async function NewFromTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select("id, name, status")
    .eq("id", id)
    .maybeSingle();
  const template = data as Pick<Template, "id" | "name" | "status"> | null;
  if (!template || template.status !== "published") notFound();

  return (
    <main>
      <div className="mb-8 animate-rise sm:mb-10">
        <BackLink href="/novo">Modelos</BackLink>
        <div className="mt-3">
          <Stepper current={1} />
        </div>
        <h1 className="page-title mt-5">{template.name}</h1>
        <p className="mt-3 text-lg text-muted">Preencha os dados. Você confere tudo antes de publicar.</p>
      </div>

      <section className="grid animate-rise items-start gap-8 lg:grid-cols-[290px_1fr] lg:gap-12">
        <figure className="lg:sticky lg:top-24">
          <div className="phone">
            <iframe
              src={`/previa/modelo/${template.id}`}
              title="Prévia do modelo com dados de exemplo"
              sandbox="allow-scripts"
            />
          </div>
          <figcaption className="mt-4 text-center text-sm text-muted">Prévia com dados de exemplo</figcaption>
        </figure>
        <div className="panel">
          <h2 className="section-title mb-6">Dados da festa</h2>
          <DetailsForm save={createInvitation.bind(null, template.id)} submitLabel="Criar convite" />
        </div>
      </section>
    </main>
  );
}
