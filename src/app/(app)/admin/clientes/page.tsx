import { removeClient } from "@/app/admin-actions";
import { ClientForm } from "@/components/client-form";
import { createClient } from "@/lib/supabase/server";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("allowed_emails").select("email").order("email");
  const clients = (data ?? []).map((row) => row.email as string);

  return (
    <main className="space-y-5">
      <h1 className="font-display text-3xl font-bold">Clientes</h1>
      <section className="panel">
        <ClientForm />
      </section>
      <section className="panel">
        <h2 className="font-display text-xl font-bold">Autorizados</h2>
        {clients.length === 0 ? (
          <p className="mt-1 text-muted">Nenhum cliente ainda.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line">
            {clients.map((email) => (
              <li key={email} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0 break-words">{email}</span>
                <form action={removeClient.bind(null, email)}>
                  <button className="min-h-11 px-2 text-sm font-bold text-danger">Remover</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
