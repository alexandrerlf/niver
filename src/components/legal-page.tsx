import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { formatEffectiveDate } from "@/lib/legal";

// Moldura das páginas públicas de Política de Privacidade e Termos de Uso.
export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 pb-20 sm:px-6 sm:pt-10">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" aria-label="Niver, página inicial" className="rounded-xl">
          <Logo />
        </Link>
        <nav aria-label="Documentos" className="flex gap-1 text-sm font-semibold">
          <Link href="/privacidade" className="rounded-full px-3 py-2 text-muted hover:bg-ink/5 hover:text-ink">
            Privacidade
          </Link>
          <Link href="/termos" className="rounded-full px-3 py-2 text-muted hover:bg-ink/5 hover:text-ink">
            Termos
          </Link>
        </nav>
      </header>
      <main className="mt-10">
        <h1 className="page-title">{title}</h1>
        <p className="mt-3 text-sm text-muted">Vigente desde {formatEffectiveDate()}.</p>
        <p className="mt-6 text-lg text-muted">{intro}</p>
        <div className="legal-text mt-10">{children}</div>
      </main>
    </div>
  );
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-6">
      <h2 id={`${id}-titulo`}>{title}</h2>
      {children}
    </section>
  );
}
