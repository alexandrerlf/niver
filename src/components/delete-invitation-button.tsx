"use client";

import { useTransition } from "react";

export function DeleteInvitationButton({
  action,
  name,
  className = "min-h-11 text-sm font-bold text-danger",
}: {
  action: () => Promise<void>;
  name: string;
  className?: string;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        const message = `Excluir o convite de ${name || "sem nome"}? O link deixa de funcionar e as presenças são apagadas.`;
        if (window.confirm(message)) start(() => action());
      }}
    >
      {pending ? "Excluindo..." : "Excluir convite"}
    </button>
  );
}
