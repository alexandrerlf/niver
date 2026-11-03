"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";

const initial: FormState = {};

export function ActionButton({
  action,
  label,
  pendingLabel,
  className = "button-primary",
}: {
  action: () => Promise<FormState>;
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  const [state, run, pending] = useActionState(action, initial);

  return (
    <form action={run}>
      <button className={className} disabled={pending}>
        {pending ? pendingLabel : label}
      </button>
      {state.error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
