import type { Metadata } from "next";
import Link from "next/link";
import { deleteAccount, signOut } from "@/app/actions";
import { DeleteAccountButton, ReviewTutorialButton } from "@/components/account-actions";
import { ErrorMessage } from "@/components/form-feedback";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Minha conta" };

const ROW =
  "flex min-h-14 w-full cursor-pointer items-center gap-3 px-5 py-3 text-left font-semibold transition duration-200 hover:bg-ink/[0.03] sm:px-6";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims.email === "string" ? data.claims.email : "";

  return (
    <main className="mx-auto max-w-xl animate-rise">
      <h1 className="page-title">Minha conta</h1>
      <p className="mt-3 break-all text-lg text-muted">{email}</p>

      {erro === "exclusao" && (
        <ErrorMessage className="mt-6">Não foi possível excluir a conta. Tente de novo em instantes.</ErrorMessage>
      )}

      <ul className="mt-8 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card shadow-soft">
        <li>
          {/* Download de arquivo: link comum, sem pré-carregamento. */}
          <a href="/api/conta/dados" download className={ROW}>
            <Icon name="download" className="size-5 text-brand" />
            <span className="flex-1">
              Baixar meus dados
              <span className="block text-sm font-normal text-muted">Conta, convites e presenças num arquivo.</span>
            </span>
          </a>
        </li>
        <li>
          <ReviewTutorialButton className={ROW} />
        </li>
        <li>
          <Link href="/privacidade" className={ROW}>
            <Icon name="shield" className="size-5 text-brand" />
            <span className="flex-1">Política de Privacidade</span>
          </Link>
        </li>
        <li>
          <Link href="/termos" className={ROW}>
            <Icon name="document" className="size-5 text-brand" />
            <span className="flex-1">Termos de Uso</span>
          </Link>
        </li>
        <li>
          <form action={signOut}>
            <button className={ROW}>
              <Icon name="logout" className="size-5 text-brand" />
              Sair
            </button>
          </form>
        </li>
      </ul>

      <section aria-labelledby="excluir-titulo" className="mt-12 border-t border-line pt-8">
        <h2 id="excluir-titulo" className="section-title">
          Excluir conta
        </h2>
        <p className="mt-2 mb-5 text-muted">
          Apaga a conta, os convites e as presenças. Se quiser guardar alguma coisa, baixe seus dados antes.
        </p>
        <DeleteAccountButton action={deleteAccount} />
      </section>
    </main>
  );
}
