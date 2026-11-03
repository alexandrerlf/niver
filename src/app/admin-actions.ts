"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/app/actions";
import { stripCodeFence, templateProblems } from "@/lib/render";
import { createClient } from "@/lib/supabase/server";
import {
  STARTER_HTML,
  emailSchema,
  parseEmails,
  templateSchema,
  type Template,
  type TemplateStatus,
} from "@/lib/template";

// As políticas RLS são a barreira real: fora do admin, estas ações não afetam nenhuma linha.

export async function createTemplate(_: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { error: "Informe o nome do modelo." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .insert({ name: name.slice(0, 80), html: STARTER_HTML })
    .select("id")
    .single();
  if (error) return { error: "Não foi possível criar o modelo." };
  redirect(`/admin/modelos/${data.id}`);
}

export async function saveTemplate(id: string, _: FormState, form: FormData): Promise<FormState> {
  const parsed = templateSchema.safeParse({
    name: form.get("name"),
    html: stripCodeFence(String(form.get("html") ?? "")),
    visibility: form.get("visibility"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revise os campos." };

  const { emails, invalid } = parseEmails(String(form.get("emails") ?? ""));
  if (invalid.length) return { error: `E-mail inválido: ${invalid[0]}` };
  if (parsed.data.visibility === "selected" && !emails.length) {
    return { error: "Informe ao menos um e-mail para liberar o modelo." };
  }

  const supabase = await createClient();
  const { data: current } = await supabase.from("templates").select("status").eq("id", id).maybeSingle();
  const problems = templateProblems(parsed.data.html);
  if (current?.status === "published" && problems.length) {
    return { error: `Modelo publicado não pode ficar incompleto: ${problems.join(", ")}.` };
  }

  const { data, error } = await supabase
    .from("templates")
    .update(parsed.data)
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { error: "Não foi possível salvar. Tente de novo." };

  // Liberar um modelo para um e-mail também autoriza esse cliente a entrar no app.
  const released = parsed.data.visibility === "selected" ? emails : [];
  const { error: clearError } = await supabase.from("template_access").delete().eq("template_id", id);
  if (clearError) return { error: "Modelo salvo, mas a liberação falhou. Salve de novo." };
  if (released.length) {
    const { error: accessError } = await supabase
      .from("template_access")
      .insert(released.map((email) => ({ template_id: id, email })));
    const { error: clientError } = await supabase
      .from("allowed_emails")
      .upsert(released.map((email) => ({ email })), { ignoreDuplicates: true });
    if (accessError || clientError) {
      return { error: "Modelo salvo, mas a liberação falhou. Salve de novo." };
    }
  }

  revalidatePath(`/admin/modelos/${id}`);
  revalidatePath("/admin/modelos");
  return { notice: "Modelo salvo." };
}

export async function saveTemplateArt(id: string, path: string): Promise<FormState> {
  if (!path.startsWith(`templates/${id}/`)) return { error: "Envio inválido." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .update({ art_path: path })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { error: "Não foi possível salvar a arte." };

  revalidatePath(`/admin/modelos/${id}`);
  return { notice: "Arte atualizada." };
}

export async function setTemplateStatus(id: string, status: TemplateStatus): Promise<FormState> {
  const supabase = await createClient();

  if (status === "published") {
    const { data } = await supabase.from("templates").select("html, art_path").eq("id", id).maybeSingle();
    const template = data as Pick<Template, "html" | "art_path"> | null;
    if (!template?.art_path) return { error: "Envie a arte antes de publicar." };
    const problems = templateProblems(template.html);
    if (problems.length) return { error: `Corrija o HTML: ${problems.join(", ")}.` };
  }

  const { data, error } = await supabase
    .from("templates")
    .update({ status })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { error: "Não foi possível atualizar o modelo." };

  revalidatePath(`/admin/modelos/${id}`);
  revalidatePath("/admin/modelos");
  revalidatePath("/novo");
  return {};
}

export async function addClient(_: FormState, form: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse(String(form.get("email") ?? "").trim());
  if (!parsed.success) return { error: "Informe um e-mail válido." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("allowed_emails")
    .upsert({ email: parsed.data }, { ignoreDuplicates: true });
  if (error) return { error: "Não foi possível adicionar o cliente." };

  revalidatePath("/admin/clientes");
  return { notice: `${parsed.data} já pode criar convites.` };
}

export async function removeClient(email: string) {
  const supabase = await createClient();
  await supabase.from("allowed_emails").delete().eq("email", email);
  revalidatePath("/admin/clientes");
}
