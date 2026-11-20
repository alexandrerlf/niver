import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";

// Variante B da apresentação, a partir da proposta de outra IA, para teste A/B.
// Tem paleta e fonte próprias e não segue o tema escuro: as cores são fixas aqui.
const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "600", "800", "900"] });

export const metadata: Metadata = {
  title: "Niver: convite de aniversário infantil do jeitinho que as crianças amam",
  description:
    "Crie convites de aniversário interativos, escolha um tema e deixe os convidados confirmarem presença pelo próprio link.",
  robots: { index: false },
};

const STEPS: { icon: IconName; title: string; text: string; tint: string }[] = [
  { icon: "image", title: "Escolha um tema", text: "Escolha entre os temas exclusivos do nosso catálogo.", tint: "bg-[#ece4fb] text-[#6636c3]" },
  { icon: "calendar", title: "Preencha os dados", text: "Informe data, horário, local e um recado para os convidados.", tint: "bg-[#fff3c8] text-[#b88a00]" },
  { icon: "message", title: "Compartilhe", text: "Envie o link pelo WhatsApp e pronto.", tint: "bg-[#d6f4f1] text-[#0e8a82]" },
];

const GUEST = [
  "Confirma presença com o nome e quantas pessoas vão",
  "Abre o mapa do local da festa",
  "Vê as sugestões de presente",
];

function Cta({ className = "", tone = "purple" }: { className?: string; tone?: "purple" | "yellow" }) {
  const colors =
    tone === "purple"
      ? "bg-[#6636c3] text-white hover:bg-[#5527b0] shadow-[0_10px_24px_-10px_rgb(102_54_195/0.7)]"
      : "bg-[#ffd34e] text-[#291b43] hover:bg-[#ffc824] shadow-[0_10px_24px_-10px_rgb(0_0_0/0.4)]";
  return (
    <Link
      href="/login"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-extrabold transition duration-200 active:scale-[0.97] ${colors} ${className}`}
    >
      Criar meu convite
      <Icon name="arrowRight" className="size-[18px]" />
    </Link>
  );
}

function Wordmark({ size = "text-3xl" }: { size?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-black tracking-tight text-[#4a1fa3] ${size}`}>
      <Image src="/brand/b/leao-cabeca.png" alt="" width={512} height={512} className="size-[1.7em]" />
      Niver
    </span>
  );
}

export default function LandingB() {
  return (
    <div className={`${nunito.className} min-h-dvh overflow-x-clip bg-[#fbfaff] text-[#291b43]`}>
      <div className="relative bg-[linear-gradient(180deg,#e9f4ff_0%,#d6ecff_55%,#c9ecc0_100%)]">
        <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-12 w-full sm:h-20">
          <path d="M0 40 C240 90 480 0 720 30 C960 60 1200 10 1440 40 L1440 80 L0 80 Z" fill="#fbfaff" />
        </svg>

        <header className="relative mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Wordmark size="text-2xl sm:text-3xl" />
          <nav className="flex items-center gap-2">
            <Link href="/login" className="inline-flex min-h-11 items-center rounded-full px-4 font-extrabold text-[#4a1fa3] hover:bg-white/60">
              Entrar
            </Link>
            <span className="hidden sm:block">
              <Cta />
            </span>
          </nav>
        </header>

        <section className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pt-4 pb-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:pb-28">
          <div>
            <h1 className="text-4xl leading-[1.05] font-black tracking-tight text-[#3d1a8f] text-balance sm:text-6xl">
              Convite de aniversário infantil do jeitinho que as crianças amam!
            </h1>
            <p className="mt-5 max-w-lg text-lg font-semibold text-[#3b2f5c] sm:text-xl">
              Crie convites interativos, escolha um tema e deixe os convidados confirmarem presença pelo próprio link.
            </p>
            <Cta className="mt-8" />
          </div>

          <div className="relative mx-auto flex w-full max-w-xl items-end justify-center">
            <Image
              src="/brand/b/leao-corpo.webp"
              alt="Leo, o leãozinho festeiro do Niver, de braços abertos"
              width={872}
              height={1026}
              priority
              sizes="(min-width: 640px) 320px, 256px"
              className="relative z-10 -mr-16 w-64 sm:w-80"
            />
            <div className="relative w-44 shrink-0 rotate-6 rounded-[2rem] bg-[#1d1630] p-1.5 shadow-[0_30px_60px_-24px_rgb(41_27_67/0.6)] sm:w-56">
              <Image
                src="/brand/convite-exemplo.webp"
                alt="Exemplo de convite de aniversário da Helena, 6 anos"
                width={940}
                height={1672}
                sizes="224px"
                className="aspect-[9/16] w-full rounded-[1.6rem] object-cover"
              />
            </div>
          </div>
        </section>
      </div>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-black text-[#3d1a8f] sm:text-4xl">Como funciona?</h2>
          <p className="mt-2 text-lg font-semibold text-[#5b4d80]">Em 3 passos, o convite fica pronto:</p>
          <ol className="mt-10 grid gap-4 text-left sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgb(41_27_67/0.25)]">
                <span className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${step.tint}`}>
                  <Icon name={step.icon} className="size-8" />
                </span>
                <span>
                  <span className="flex items-center gap-2 text-lg font-black">
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#6636c3] text-sm text-white">{index + 1}</span>
                    {step.title}
                  </span>
                  <span className="mt-1 block text-[#5b4d80]">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-16 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#f1ecfc] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-[#3d1a8f] sm:text-3xl">E o convidado, o que faz?</h2>
            <p className="mt-1 text-lg font-semibold text-[#5b4d80]">É simples e rápido!</p>
            <ul className="mt-6 space-y-4">
              {GUEST.map((text) => (
                <li key={text} className="flex items-start gap-3 text-lg">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#16b8ad] text-white">
                    <Icon name="check" className="size-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-[#f1ecfc] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-[#3d1a8f] sm:text-3xl">Acompanhe as confirmações</h2>
            <p className="mt-1 text-lg font-semibold text-[#5b4d80]">Veja quem confirmou e quantas pessoas vêm, direto no app.</p>
            <div className="mt-6 grid grid-cols-2 divide-x divide-[#e6def8] rounded-2xl bg-white p-5 shadow-[0_8px_30px_-16px_rgb(41_27_67/0.25)]">
              <div className="flex items-center gap-3 pr-4">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#ece4fb] text-[#6636c3]">
                  <Icon name="users" className="size-6" />
                </span>
                <span>
                  <span className="block text-3xl font-black">12</span>
                  <span className="text-sm text-[#5b4d80]">Confirmados</span>
                </span>
              </div>
              <div className="flex items-center gap-3 pl-4">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#d6f4f1] text-[#0e8a82]">
                  <Icon name="users" className="size-6" />
                </span>
                <span>
                  <span className="block text-3xl font-black">28</span>
                  <span className="text-sm text-[#5b4d80]">Total de pessoas</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6">
          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-[2rem] bg-[#4a1fa3] px-6 pt-4 pb-10 text-center text-white sm:flex-row sm:pr-10 sm:pb-4 sm:text-left">
            <Image src="/brand/b/leao-presente.webp" alt="" width={454} height={448} sizes="192px" className="-mt-14 w-40 sm:-mb-4 sm:w-48" />
            <div className="flex-1">
              <h2 className="text-2xl font-black sm:text-3xl">Deixe a festa ainda mais especial!</h2>
              <p className="mt-1 text-white/85">Crie o convite agora e comece a alegria antes mesmo da festa.</p>
            </div>
            <Cta tone="yellow" />
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ece6fa]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <Wordmark size="text-xl" />
          <Link href="/login" className="font-extrabold text-[#4a1fa3]">
            Entrar
          </Link>
        </div>
      </footer>
    </div>
  );
}
