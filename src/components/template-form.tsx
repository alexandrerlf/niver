"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/app/actions";
import { saveTemplate } from "@/app/admin-actions";
import { FormFeedback } from "@/components/form-feedback";
import type { Template } from "@/lib/template";

const initial: FormState = {};

export function TemplateForm({ template, emails }: { template: Template; emails: string[] }) {
  const [state, action, pending] = useActionState(saveTemplate.bind(null, template.id), initial);
  const [visibility, setVisibility] = useState(template.visibility);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">
          Nome
        </label>
        <input
          className="field"
          id="name"
          name="name"
          defaultValue={template.name}
          maxLength={80}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="html">
          HTML do modelo
        </label>
        <textarea
          className="field min-h-80 resize-y font-mono text-sm"
          id="html"
          name="html"
          defaultValue={template.html}
          spellCheck={false}
        />
      </div>

      <fieldset>
        <legend className="label">Quem pode usar</legend>
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="radio"
            name="visibility"
            value="all"
            checked={visibility === "all"}
            onChange={() => setVisibility("all")}
          />
          Todos os clientes
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="radio"
            name="visibility"
            value="selected"
            checked={visibility === "selected"}
            onChange={() => setVisibility("selected")}
          />
          Só os e-mails abaixo
        </label>
      </fieldset>

      {visibility === "selected" && (
        <div>
          <label className="label" htmlFor="emails">
            E-mails liberados (um por linha)
          </label>
          <textarea
            className="field min-h-24"
            id="emails"
            name="emails"
            inputMode="email"
            defaultValue={emails.join("\n")}
          />
          <p className="mt-1 text-sm text-muted">
            Quem estiver aqui também passa a poder criar convites.
          </p>
        </div>
      )}

      <FormFeedback state={state} />
      <button className="button-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Salvando..." : "Salvar modelo"}
      </button>
    </form>
  );
}
