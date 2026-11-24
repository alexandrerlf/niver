import { createClient } from "@supabase/supabase-js";

// Cliente com a chave secreta: passa por cima da RLS. Só para o servidor, nunca em componente de cliente.
// Usado para gravar cobranças e chamar `publish_invitation`, que o cliente não pode executar.
export function createServiceClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY não configurada.");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type ServiceClient = ReturnType<typeof createServiceClient>;
