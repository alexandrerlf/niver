"use client";

import { ConfirmButton } from "@/components/confirm-button";
import { Icon } from "@/components/icons";
import { openTutorial } from "@/components/welcome";

export function ReviewTutorialButton({ className }: { className: string }) {
  return (
    <button type="button" className={className} onClick={openTutorial}>
      <Icon name="help" className="size-5 text-brand" />
      Rever tutorial
    </button>
  );
}

export function DeleteAccountButton({ action }: { action: () => Promise<void> }) {
  return (
    <ConfirmButton
      action={action}
      title="Excluir sua conta?"
      description="Sua conta, todos os seus convites e as presenças confirmadas são apagados agora. Os links que você enviou deixam de abrir. Não dá para desfazer."
      confirmLabel="Excluir conta"
      pendingLabel="Excluindo…"
      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-danger/30 px-5 text-sm font-semibold text-danger transition duration-200 hover:bg-danger/10"
    >
      <Icon name="trash" className="size-[18px]" />
      Excluir minha conta
    </ConfirmButton>
  );
}
