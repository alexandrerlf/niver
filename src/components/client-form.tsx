"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import { addClient } from "@/app/admin-actions";
import { FormFeedback } from "@/components/form-feedback";

const initial: FormState = {};

export function ClientForm() {
  const [state, action, pending] = useActionState(addClient, initial);

  return (
    <form action={action}>
      <label className="label" htmlFor="email">
        E-mail do cliente
      </label>
      <div className="flex gap-3">
        <input className="field" id="email" name="email" type="email" required autoComplete="off" />
        <button className="button-primary shrink-0" disabled={pending}>
          {pending ? "Adicionando..." : "Adicionar"}
        </button>
      </div>
      <div className="mt-2">
        <FormFeedback state={state} />
      </div>
    </form>
  );
}
