"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import { createTemplate } from "@/app/admin-actions";
import { FormFeedback } from "@/components/form-feedback";
import { Icon, Spinner } from "@/components/icons";

const initial: FormState = {};

export function NewTemplateForm() {
  const [state, action, pending] = useActionState(createTemplate, initial);

  return (
    <form action={action}>
      <label className="label" htmlFor="name">
        Nome do novo modelo
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="field"
          id="name"
          name="name"
          maxLength={80}
          required
          placeholder="Ex.: Fundo do mar"
        />
        <button className="button-primary shrink-0" disabled={pending}>
          {pending ? <Spinner /> : <Icon name="plus" className="size-[18px]" />}
          {pending ? "Criando..." : "Criar modelo"}
        </button>
      </div>
      <FormFeedback state={state} className="mt-3" />
    </form>
  );
}
