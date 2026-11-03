import { notFound } from "next/navigation";
import { createInvitation } from "@/app/actions";
import { DetailsForm } from "@/components/details-form";
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
    <main className="space-y-5">
      <h1 className="font-display text-3xl font-bold">{template.name}</h1>
      <section className="grid gap-5 sm:grid-cols-[280px_1fr]">
        <iframe
          src={`/previa/modelo/${template.id}`}
          title="Prévia do modelo com dados de exemplo"
          sandbox="allow-scripts"
          className="mx-auto aspect-[9/16] w-full max-w-[280px] rounded-2xl border border-line bg-white"
        />
        <div className="panel">
          <h2 className="mb-4 font-display text-xl font-bold">Dados da festa</h2>
          <DetailsForm save={createInvitation.bind(null, template.id)} submitLabel="Criar convite" />
        </div>
      </section>
    </main>
  );
}
