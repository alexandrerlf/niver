"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import type { FormState } from "@/app/actions";
import { FormFeedback } from "@/components/form-feedback";
import { Icon, Spinner, type IconName } from "@/components/icons";
import type { Invitation } from "@/lib/invitation";

const initial: FormState = {};

type Values = Pick<
  Invitation,
  "child_name" | "age" | "event_date" | "event_time" | "rsvp_deadline" | "location_name" | "maps_url" | "message" | "gifts"
>;

const EMPTY: Values = {
  child_name: "",
  age: null,
  event_date: null,
  event_time: null,
  rsvp_deadline: null,
  location_name: "",
  maps_url: null,
  message: "",
  gifts: [],
};

function Group({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-4 flex items-center gap-2.5 text-sm font-bold">
        <span className="flex size-8 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon name={icon} className="size-[18px]" />
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function DetailsForm({
  save,
  invitation = EMPTY,
  submitLabel,
  askGuardianConsent = false,
}: {
  save: (state: FormState, form: FormData) => Promise<FormState>;
  invitation?: Values;
  submitLabel: string;
  // Só na criação: o responsável autoriza o uso do nome e da idade da criança.
  askGuardianConsent?: boolean;
}) {
  const [state, action, pending] = useActionState(save, initial);

  return (
    <form action={action} className="space-y-8">
      <Group icon="cake" title="Aniversariante">
        <div>
          <label className="label" htmlFor="child_name">
            Nome
          </label>
          <input
            className="field"
            id="child_name"
            name="child_name"
            defaultValue={invitation.child_name}
            maxLength={120}
            placeholder="Ex.: Lia"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="age">
            Idade <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input
            className="field"
            id="age"
            name="age"
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            placeholder="Ex.: 6"
            defaultValue={invitation.age ?? ""}
          />
        </div>
      </Group>

      <Group icon="calendar" title="Quando e onde">
        <div>
          <label className="label" htmlFor="event_date">
            Data
          </label>
          <input
            className="field"
            id="event_date"
            name="event_date"
            type="date"
            defaultValue={invitation.event_date ?? ""}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="event_time">
            Horário
          </label>
          <input
            className="field"
            id="event_time"
            name="event_time"
            type="time"
            defaultValue={invitation.event_time ?? ""}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="location_name">
            Local
          </label>
          <input
            className="field"
            id="location_name"
            name="location_name"
            defaultValue={invitation.location_name}
            maxLength={200}
            placeholder="Ex.: Buffet Alegria"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="maps_url">
            Link do mapa <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input
            className="field"
            id="maps_url"
            name="maps_url"
            type="url"
            inputMode="url"
            placeholder="https://maps.app.goo.gl/..."
            defaultValue={invitation.maps_url ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="rsvp_deadline">
            Confirmar presença até <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input
            className="field"
            id="rsvp_deadline"
            name="rsvp_deadline"
            type="date"
            aria-describedby="rsvp-deadline-hint"
            defaultValue={invitation.rsvp_deadline ?? ""}
          />
          <p id="rsvp-deadline-hint" className="hint">
            Depois desse dia, o convite não aceita novas confirmações.
          </p>
        </div>
      </Group>

      <Group icon="gift" title="Recado e presentes">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="message">
            Mensagem <span className="font-normal text-muted">(opcional)</span>
          </label>
          <textarea
            className="field min-h-28"
            id="message"
            name="message"
            maxLength={500}
            placeholder="Um recado para os convidados"
            defaultValue={invitation.message}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="gifts">
            Sugestões de presentes <span className="font-normal text-muted">(opcional)</span>
          </label>
          <textarea
            className="field min-h-28"
            id="gifts"
            name="gifts"
            aria-describedby="gifts-hint"
            placeholder={"Livros\nBlocos de montar"}
            defaultValue={invitation.gifts.join("\n")}
          />
          <p id="gifts-hint" className="hint">
            Uma sugestão por linha.
          </p>
        </div>
      </Group>

      {askGuardianConsent && (
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-sunken/60 p-4 text-sm">
          <input
            type="checkbox"
            name="guardian_consent"
            required
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand"
          />
          <span>
            Sou mãe, pai ou responsável pela criança e autorizo o uso do nome e da idade dela neste convite.{" "}
            <Link href="/privacidade#criancas" target="_blank" className="font-semibold text-brand underline underline-offset-2">
              Como cuidamos desses dados
            </Link>
          </span>
        </label>
      )}

      <div>
        <FormFeedback state={state} className="mb-4" />
        <button className="button-primary w-full sm:w-auto" disabled={pending}>
          {pending && <Spinner />}
          {pending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
