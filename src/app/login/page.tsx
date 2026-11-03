import { LoginForm } from "@/components/login-form";
import { signInWithGoogle } from "@/app/actions";

const ERRORS: Record<string, string> = {
  google: "Não foi possível entrar com o Google. Use e-mail e senha ou tente mais tarde.",
  confirmacao: "Este link expirou ou é inválido. Entre novamente.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-5xl font-extrabold text-coral">Niver</h1>
      <p className="mt-1 mb-6 text-lg text-muted">
        Descreva a festa. A gente cria o convite interativo.
      </p>
      <div className="panel">
        {erro && ERRORS[erro] && (
          <p role="alert" className="mb-4 text-sm font-semibold text-danger">
            {ERRORS[erro]}
          </p>
        )}
        <form action={signInWithGoogle}>
          <button className="button-secondary w-full">Entrar com Google</button>
        </form>
        <div className="my-5 flex items-center gap-3 text-sm text-muted">
          <span className="h-px flex-1 bg-line" />
          ou
          <span className="h-px flex-1 bg-line" />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
