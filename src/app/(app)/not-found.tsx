import Link from "next/link";
import { EmptyState } from "@/components/art-card";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <main>
      <EmptyState
        icon={<Icon name="mail" className="size-8" />}
        title="Não encontramos esta página"
        action={
          <Link href="/" className="button-primary">
            Ver meus convites
          </Link>
        }
      >
        O endereço pode ter mudado, ou o convite foi excluído.
      </EmptyState>
    </main>
  );
}
