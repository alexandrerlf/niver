"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import { FormFeedback } from "@/components/form-feedback";
import type { Invitation } from "@/lib/invitation";

const initial: FormState = {};

type Values = Pick<
  Invitation,
  "child_name" | "age" | "event_date" | "event_time" | "location_name" | "maps_url" | "message" | "gifts"
>;

const EMPTY: Values = {
  child_name: "",
  age: null,
  event_date: null,
  event_time: null,
  location_name: "",
  maps_url: null,
  message: "",
  gifts: [],
};

export function DetailsForm({
  save,
  invitation = EMPTY,
  submitLabel,
}: {
  save: (state: FormState, form: FormData) => Promise<FormState>;
  invitation?: Values;
  submitLabel: string;
}) {
  const [state, action, pending] = useActionState(save, initial);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
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
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="age">
          Idade
        </label>
        <input
          className="field"
          id="age"
          name="age"
          type="number"
          inputMode="numeric"
          min={0}
          max={120}
          defaultValue={invitation.age ?? ""}
        />
      </div>
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
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="maps_url">
          Link do mapa (opcional)
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
      <div className="sm:col-span-2">
        <label className="label" htmlFor="message">
          Mensagem
        </label>
        <textarea
          className="field min-h-24"
          id="message"
          name="message"
          maxLength={500}
          defaultValue={invitation.message}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="gifts">
          Sugestões de presentes (uma por linha)
        </label>
        <textarea
          className="field min-h-24"
          id="gifts"
          name="gifts"
          defaultValue={invitation.gifts.join("\n")}
        />
      </div>
      <div className="sm:col-span-2">
        <FormFeedback state={state} />
        <button className="button-primary w-full sm:w-auto" disabled={pending}>
          {pending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
