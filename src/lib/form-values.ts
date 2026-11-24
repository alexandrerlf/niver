import type { ZodError } from "zod";

export type FormErrorState = { error: string; field?: string; values: Record<string, string> };

// Resposta de formulário com erro: mostra a primeira mensagem e devolve o que a pessoa digitou,
// menos o campo com problema, para o formulário não voltar em branco.
export function formError(form: FormData, error: ZodError): FormErrorState {
  const issue = error.issues[0];
  const field = typeof issue?.path[0] === "string" ? issue.path[0] : undefined;
  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string" && key !== field && !key.startsWith("$")) values[key] = value;
  }
  return { error: issue?.message ?? "Revise os campos.", field, values };
}
