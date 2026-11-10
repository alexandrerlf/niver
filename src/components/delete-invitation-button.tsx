"use client";

import { useRef, useTransition } from "react";
import { Icon, Spinner } from "@/components/icons";

export function DeleteInvitationButton({
  action,
  name,
  variant = "text",
}: {
  action: () => Promise<void>;
  name: string;
  variant?: "text" | "overlay";
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();
  const who = name || "sem nome";

  return (
    <>
      {variant === "overlay" ? (
        <button
          type="button"
          aria-label={`Excluir o convite de ${who}`}
          onClick={() => dialog.current?.showModal()}
          className="absolute top-2 right-2 flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition duration-200 group-hover:opacity-100 hover:bg-danger focus-visible:opacity-100 active:scale-95 [@media(hover:hover)]:opacity-0"
        >
          <Icon name="trash" className="size-[18px]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold text-danger transition duration-200 hover:bg-danger/10"
        >
          <Icon name="trash" className="size-[18px]" />
          Excluir convite
        </button>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="delete-title"
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-line bg-card p-6 text-ink shadow-lift backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-rise sm:p-7"
      >
        <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <Icon name="trash" className="size-6" />
        </span>
        <h2 id="delete-title" className="section-title">
          Excluir o convite de {who}?
        </h2>
        <p className="mt-2 text-muted">
          O link deixa de funcionar e as presenças confirmadas são apagadas. Não dá para desfazer.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="button-secondary"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="button-danger"
            disabled={pending}
            onClick={() => start(() => action())}
          >
            {pending && <Spinner />}
            {pending ? "Excluindo..." : "Excluir convite"}
          </button>
        </div>
      </dialog>
    </>
  );
}
