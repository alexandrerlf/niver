import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      <header className="flex items-center justify-between gap-3 py-4">
        <Link href="/" className="font-display text-3xl font-extrabold text-coral">
          Niver
        </Link>
        <nav className="flex items-center gap-1 text-sm font-bold text-muted">
          {isAdmin === true && (
            <>
              <Link href="/admin/modelos" className="flex min-h-11 items-center px-2 hover:text-ink">
                Modelos
              </Link>
              <Link href="/admin/clientes" className="flex min-h-11 items-center px-2 hover:text-ink">
                Clientes
              </Link>
            </>
          )}
          <form action={signOut}>
            <button className="min-h-11 px-2 font-bold hover:text-ink">Sair</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
