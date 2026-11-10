"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/app/actions";
import { saveTemplate } from "@/app/admin-actions";
import { FormFeedback } from "@/components/form-feedback";
import { Icon, Spinner, type IconName } from "@/components/icons";
import type { Template, TemplateVisibility } from "@/lib/template";

const initial: FormState = {};

const AUDIENCES: { value: TemplateVisibility; icon: IconName; title: string; text: string }[] = [
  { value: "all", icon: "users", title: "Todos os clientes", text: "Aparece para qualquer conta autorizada." },
  { value: "selected", icon: "mail", title: "Só alguns e-mails", text: "Aparece apenas para quem você listar." },
];

export function TemplateForm({ template, emails }: { template: Template; emails: string[] }) {
  const [state, action, pending] = useActionState(saveTemplate.bind(null, template.id), initial);
  const [visibility, setVisibility] = useState(template.visibility);

  return (
    <form action={action} className="space-y-6">
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
          className="field min-h-96 resize-y bg-sunken font-mono text-[13px] leading-relaxed"
          id="html"
          name="html"
          defaultValue={template.html}
          spellCheck={false}
        />
      </div>

      <fieldset>
        <legend className="label">Quem pode usar</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {AUDIENCES.map((audience) => (
            <label
              key={audience.value}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-card p-4 transition duration-200 hover:border-ink/20 has-checked:border-coral has-checked:bg-coral/5 has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-coral"
            >
              <input
                type="radio"
                name="visibility"
                value={audience.value}
                checked={visibility === audience.value}
                onChange={() => setVisibility(audience.value)}
                className="peer sr-only"
              />
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sunken text-muted transition duration-200 peer-checked:bg-coral peer-checked:text-on-coral">
                <Icon name={audience.icon} className="size-[18px]" />
              </span>
              <span>
                <span className="block font-semibold">{audience.title}</span>
                <span className="block text-sm text-muted">{audience.text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {visibility === "selected" && (
        <div className="animate-rise">
          <label className="label" htmlFor="emails">
            E-mails liberados
          </label>
          <textarea
            className="field min-h-28"
            id="emails"
            name="emails"
            inputMode="email"
            aria-describedby="emails-hint"
            placeholder={"ana@exemplo.com\nbruno@exemplo.com"}
            defaultValue={emails.join("\n")}
          />
          <p id="emails-hint" className="hint">
            Um por linha. Quem estiver aqui também passa a poder criar convites.
          </p>
        </div>
      )}

      <div>
        <FormFeedback state={state} className="mb-4" />
        <button className="button-primary w-full sm:w-auto" disabled={pending}>
          {pending && <Spinner />}
          {pending ? "Salvando..." : "Salvar modelo"}
        </button>
      </div>
    </form>
  );
}
