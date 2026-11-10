"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import { addClient } from "@/app/admin-actions";
import { FormFeedback } from "@/components/form-feedback";
import { Icon, Spinner } from "@/components/icons";

const initial: FormState = {};

export function ClientForm() {
  const [state, action, pending] = useActionState(addClient, initial);

  return (
    <form action={action}>
      <label className="label" htmlFor="email">
        E-mail do cliente
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="field"
          id="email"
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="cliente@exemplo.com"
        />
        <button className="button-primary shrink-0" disabled={pending}>
          {pending ? <Spinner /> : <Icon name="plus" className="size-[18px]" />}
          {pending ? "Adicionando..." : "Adicionar"}
        </button>
      </div>
      <FormFeedback state={state} className="mt-3" />
    </form>
  );
}
