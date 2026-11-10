import type { Metadata } from "next";
import { removeClient } from "@/app/admin-actions";
import { ClientForm } from "@/components/client-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Clientes" };

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("allowed_emails").select("email").order("email");
  const clients = (data ?? []).map((row) => row.email as string);

  return (
    <main className="mx-auto max-w-2xl">
      <div className="mb-8 animate-rise sm:mb-10">
        <p className="eyebrow">Admin</p>
        <h1 className="page-title mt-2">Clientes</h1>
        <p className="mt-3 text-lg text-muted">Quem está aqui pode criar convites.</p>
      </div>

      <div className="animate-rise space-y-6">
        <section className="panel">
          <ClientForm />
        </section>

        <section className="panel">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="section-title">Autorizados</h2>
            {clients.length > 0 && <span className="badge bg-sunken text-muted">{clients.length}</span>}
          </div>
          {clients.length === 0 ? (
            <p className="mt-1 text-muted">Nenhum cliente ainda. Adicione o primeiro e-mail acima.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {clients.map((email) => (
                <li key={email} className="flex items-center gap-3 py-2.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-coral/10 font-bold text-coral uppercase">
                    {email.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1 font-medium break-words">{email}</span>
                  <form action={removeClient.bind(null, email)}>
                    <button className="min-h-11 cursor-pointer rounded-full px-3 text-sm font-semibold text-danger transition duration-200 hover:bg-danger/10">
                      Remover
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
