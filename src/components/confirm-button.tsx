"use client";

import { useId, useRef, useTransition, type ReactNode } from "react";
import { Icon, Spinner } from "@/components/icons";

// Botão de ação destrutiva: abre uma janela e só age depois da confirmação.
export function ConfirmButton({
  action,
  title,
  description,
  confirmLabel,
  pendingLabel,
  className,
  ariaLabel,
  children,
}: {
  action: () => Promise<void>;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  className: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [pending, start] = useTransition();

  return (
    <>
      <button type="button" aria-label={ariaLabel} className={className} onClick={() => dialog.current?.showModal()}>
        {children}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="m-auto w-[min(92vw,26rem)] overscroll-contain rounded-3xl border border-line bg-card p-6 text-ink shadow-lift backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-rise sm:p-7"
      >
        <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <Icon name="trash" className="size-6" />
        </span>
        <h2 id={titleId} className="section-title break-words">
          {title}
        </h2>
        <p className="mt-2 text-muted">{description}</p>
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
            onClick={() =>
              start(async () => {
                await action();
                dialog.current?.close();
              })
            }
          >
            {pending && <Spinner />}
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
