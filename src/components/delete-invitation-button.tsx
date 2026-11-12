import { ConfirmButton } from "@/components/confirm-button";
import { Icon } from "@/components/icons";

export function DeleteInvitationButton({
  action,
  name,
  variant = "text",
}: {
  action: () => Promise<void>;
  name: string;
  variant?: "text" | "overlay";
}) {
  const who = name || "sem nome";
  const overlay = variant === "overlay";

  return (
    <ConfirmButton
      action={action}
      title={`Excluir o convite de ${who}?`}
      description="O link deixa de funcionar e as presenças confirmadas são apagadas. Não dá para desfazer."
      confirmLabel="Excluir convite"
      pendingLabel="Excluindo…"
      ariaLabel={overlay ? `Excluir o convite de ${who}` : undefined}
      className={
        overlay
          ? "absolute top-2 right-2 flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition duration-200 group-hover:opacity-100 hover:bg-danger focus-visible:opacity-100 active:scale-95 [@media(hover:hover)]:opacity-0"
          : "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold text-danger transition duration-200 hover:bg-danger/10"
      }
    >
      <Icon name="trash" className="size-[18px]" />
      {!overlay && "Excluir convite"}
    </ConfirmButton>
  );
}
