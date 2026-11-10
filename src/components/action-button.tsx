"use client";

import { useActionState, type ReactNode } from "react";
import type { FormState } from "@/app/actions";
import { ErrorMessage } from "@/components/form-feedback";
import { Spinner } from "@/components/icons";

const initial: FormState = {};

export function ActionButton({
  action,
  label,
  pendingLabel,
  icon,
  className = "button-primary",
}: {
  action: () => Promise<FormState>;
  label: string;
  pendingLabel: string;
  icon?: ReactNode;
  className?: string;
}) {
  const [state, run, pending] = useActionState(action, initial);

  return (
    <form action={run}>
      <button className={className} disabled={pending}>
        {pending ? <Spinner /> : icon}
        {pending ? pendingLabel : label}
      </button>
      {state.error && <ErrorMessage className="mt-3">{state.error}</ErrorMessage>}
    </form>
  );
}
