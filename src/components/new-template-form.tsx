"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import { createTemplate } from "@/app/admin-actions";
import { FormFeedback } from "@/components/form-feedback";

const initial: FormState = {};

export function NewTemplateForm() {
  const [state, action, pending] = useActionState(createTemplate, initial);

  return (
    <form action={action}>
      <label className="label" htmlFor="name">
        Nome do novo modelo
      </label>
      <div className="flex gap-3">
        <input
          className="field"
          id="name"
          name="name"
          maxLength={80}
          required
          placeholder="Ex.: Fundo do mar"
        />
        <button className="button-primary shrink-0" disabled={pending}>
          {pending ? "Criando..." : "Criar"}
        </button>
      </div>
      <div className="mt-2">
        <FormFeedback state={state} />
      </div>
    </form>
  );
}
