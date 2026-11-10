import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { BottomNav, TopNav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const [{ data: isAdmin }, { data: auth }] = await Promise.all([
    supabase.rpc("is_admin"),
    supabase.auth.getClaims(),
  ]);
  const admin = isAdmin === true;
  const email = typeof auth?.claims.email === "string" ? auth.claims.email : "";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="Niver, início" className="rounded-xl">
            <Logo />
          </Link>
          {admin && <TopNav />}
          <div className="flex items-center gap-1">
            {email && (
              <span
                title={email}
                className="flex size-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper uppercase"
              >
                {email.charAt(0)}
              </span>
            )}
            <form action={signOut}>
              <button className="icon-button" aria-label="Sair" title="Sair">
                <Icon name="logout" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className={`mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-12 ${admin ? "pb-32 sm:pb-20" : "pb-20"}`}>
        {children}
      </div>
      {admin && <BottomNav />}
    </>
  );
}
