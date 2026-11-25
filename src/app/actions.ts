"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ART_BUCKET,
  hasEventDetails,
  makeSlug,
  parseDetails,
  parseNewDetails,
  type Invitation,
} from "@/lib/invitation";
import { formError } from "@/lib/form-values";
import { slugCode } from "@/lib/slug-code";
import { createClient, getUserId } from "@/lib/supabase/server";
import { type Template } from "@/lib/template";

// `values` devolve o que foi digitado quando há erro, para o formulário não voltar em branco; `field` é o campo com problema.
export type FormState = { error?: string; notice?: string; field?: string; values?: Record<string, string> };

async function callbackUrl() {
  const origin = (await headers()).get("origin");
  return `${origin}/auth/callback`;
}

function credentials(form: FormData) {
  return {
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  };
}

export async function signInWithPassword(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials(form));
  if (error) return { error: "E-mail ou senha incorretos, ou e-mail ainda não confirmado." };
  redirect("/convites");
}

export async function signUp(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    ...credentials(form),
    options: { emailRedirectTo: await callbackUrl() },
  });
  if (error) return { error: "Não foi possível criar a conta. Use uma senha de 8 ou mais caracteres." };
  return { notice: "Enviamos um link de confirmação para o seu e-mail." };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: await callbackUrl() },
  });
  if (error || !data.url) redirect("/login?erro=google");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createInvitation(
  templateId: string,
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = parseNewDetails(form);
  if (!parsed.success) return formError(form, parsed.error);

  const supabase = await createClient();
  const ownerId = await getUserId(supabase);
  if (!ownerId) redirect("/login");

  const { data: template } = await supabase
    .from("templates")
    .select("id, html, art_path, status")
    .eq("id", templateId)
    .maybeSingle();
  const chosen = template as Pick<Template, "id" | "html" | "art_path" | "status"> | null;
  if (!chosen || chosen.status !== "published" || !chosen.art_path) {
    return { error: "Este modelo não está disponível." };
  }

  const { child_name, age } = parsed.data;
  const { data, error } = await supabase
    .from("invitations")
    .insert({
      ...parsed.data,
      owner_id: ownerId,
      slug: makeSlug(child_name, age, slugCode()),
      guardian_consent_at: new Date().toISOString(),
      template_id: chosen.id,
      image_path: chosen.art_path,
      html_template: chosen.html,
    })
    .select("id")
    .single();
  if (error) {
    console.error("createInvitation", error);
    return { error: "Não foi possível criar o convite. Sua conta está autorizada?" };
  }
  redirect(`/convites/${data.id}`);
}

export async function saveDetails(id: string, _: FormState, form: FormData): Promise<FormState> {
  const parsed = parseDetails(form);
  if (!parsed.success) return formError(form, parsed.error);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .update(parsed.data)
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { error: "Não foi possível salvar. Tente de novo." };

  revalidatePath(`/convites/${id}`);
  return { notice: "Alterações salvas." };
}

// A arte do modelo é compartilhada: só a que um cliente enviou antes, quando isso era permitido,
// pode ser apagada com o convite.
async function removeOwnArt(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ownerId: string,
  path: string | null | undefined,
) {
  if (path?.startsWith(`${ownerId}/`)) await supabase.storage.from(ART_BUCKET).remove([path]);
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient();
  const ownerId = await getUserId(supabase);
  if (!ownerId) redirect("/login");

  const { data } = await supabase.from("invitations").select("image_path").eq("id", id).maybeSingle();
  await supabase.from("invitations").delete().eq("id", id);
  await removeOwnArt(supabase, ownerId, data?.image_path);

  revalidatePath("/convites");
  redirect("/convites");
}

// Marca na conta que o tutorial foi visto, para não aparecer de novo em nenhum aparelho.
export async function completeTutorial() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims || data.claims.user_metadata?.onboarded_at) return;
  const { error } = await supabase.auth.updateUser({ data: { onboarded_at: new Date().toISOString() } });
  if (error) {
    console.error("completeTutorial", error);
    return;
  }
  // Renova o token para a marca já valer nas próximas páginas.
  await supabase.auth.refreshSession();
}

// Exclusão da conta pelo titular (art. 18 da LGPD). Convites e presenças caem junto no banco.
export async function deleteAccount() {
  const supabase = await createClient();
  const ownerId = await getUserId(supabase);
  if (!ownerId) redirect("/login");

  // Artes enviadas pelo próprio cliente ficam numa pasta com o id dele; as dos modelos não são apagadas.
  const { data: invitations } = await supabase.from("invitations").select("image_path").eq("owner_id", ownerId);
  for (const invitation of invitations ?? []) await removeOwnArt(supabase, ownerId, invitation.image_path);

  const { error } = await supabase.rpc("delete_my_account");
  if (error) {
    console.error("deleteAccount", error);
    redirect("/conta?erro=exclusao");
  }
  // A conta já não existe: encerra só a sessão deste navegador, sem chamar o servidor.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}
