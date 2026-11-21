import type { Metadata } from "next";
import Link from "next/link";
import { signInWithGoogle } from "@/app/actions";
import { ErrorMessage } from "@/components/form-feedback";
import { GoogleIcon } from "@/components/icons";
import { LoginForm } from "@/components/login-form";
import { LoginShowcase } from "@/components/login-showcase";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Entrar" };

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
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-4 lg:p-4">
      <main className="mx-auto flex w-full max-w-md animate-rise flex-col justify-center px-5 py-12 sm:px-8">
        <Logo className="text-3xl" />
        <h1 className="page-title mt-10">Convites que a festa merece.</h1>
        <p className="mt-4 mb-8 text-lg text-muted">
          Escolha um modelo, preencha os dados e compartilhe o link. Os convidados confirmam presença ali
          mesmo.
        </p>

        {erro && ERRORS[erro] && <ErrorMessage className="mb-5">{ERRORS[erro]}</ErrorMessage>}

        <form action={signInWithGoogle}>
          <button className="button-secondary w-full">
            <GoogleIcon />
            Continuar com Google
          </button>
        </form>
        <div className="my-6 flex items-center gap-4 text-sm text-muted">
          <span className="h-px flex-1 bg-line" />
          ou com e-mail
          <span className="h-px flex-1 bg-line" />
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted">
          Ao continuar, você concorda com os{" "}
          <Link href="/termos" className="font-semibold text-brand underline underline-offset-2">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link href="/privacidade" className="font-semibold text-brand underline underline-offset-2">
            Política de Privacidade
          </Link>
          .
        </p>
      </main>
      <LoginShowcase />
    </div>
  );
}
