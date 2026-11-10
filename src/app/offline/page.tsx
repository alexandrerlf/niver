import { Logo } from "@/components/logo";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <Logo className="text-3xl" />
      <h1 className="page-title mt-10">Você está sem internet</h1>
      <p className="mt-4 text-lg text-muted">Conecte-se para ver seus convites e criar novos.</p>
    </main>
  );
}
