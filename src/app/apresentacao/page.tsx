import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Niver: convites de aniversário que os convidados respondem",
  description:
    "Escolha um tema, preencha os dados da festa e mande o link pelo WhatsApp. Os convidados confirmam presença, abrem o mapa e veem as sugestões de presente.",
  openGraph: {
    title: "Niver: convites de aniversário que os convidados respondem",
    description: "Convite com confirmação de presença, mapa e sugestões de presente num link só.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
};

const STEPS = [
  {
    title: "Escolha o tema",
    text: "Modelos desenhados para cada festa, prontos para receber o nome e a idade.",
  },
  {
    title: "Preencha a festa",
    text: "Data, horário, local, um recado e, se quiser, sugestões de presente e prazo para responder.",
  },
  {
    title: "Mande o link",
    text: "Um link só, que você envia pelo WhatsApp quantas vezes quiser.",
  },
];

const GUEST: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "check",
    title: "Confirma presença",
    text: "Diz o nome e quantas pessoas vão, ali mesmo no convite. Sem baixar nada.",
  },
  {
    icon: "pin",
    title: "Chega sem se perder",
    text: "Um toque no local abre o mapa com o endereço da festa.",
  },
  {
    icon: "gift",
    title: "Acerta no presente",
    text: "Vê as sugestões que você deixou, como o tamanho da roupa ou o número do sapato.",
  },
];

const RSVPS = [
  { name: "Vovó Ana", people: 3 },
  { name: "Família Souza", people: 4 },
  { name: "Tio Bruno", people: 1 },
];

function StartLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/login" className={`button-primary ${className}`}>
      Criar meu convite
      <Icon name="arrowRight" className="size-[18px]" />
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-x-clip">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-ink transition duration-200 hover:bg-ink/5"
        >
          Entrar
        </Link>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-8 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-14 lg:pb-28">
          <div className="animate-rise">
            <h1 className="font-display text-5xl leading-[1.02] font-semibold text-balance sm:text-6xl lg:text-7xl">
              O convite que os convidados respondem.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-muted sm:text-xl">
              Escolha um tema, preencha os dados da festa e mande o link pelo WhatsApp. Quem recebe confirma
              presença, abre o mapa e vê as sugestões de presente, tudo no próprio convite.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <StartLink />
              <a href="#como-funciona" className="button-secondary">
                Ver como funciona
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[22rem] animate-rise [animation-delay:120ms] sm:max-w-sm">
            <div className="phone max-w-none! rotate-2">
              <Image
                src="/brand/convite-exemplo.webp"
                alt="Exemplo de convite de aniversário da Helena, 6 anos, com data, horário, local e botão de confirmar presença"
                width={940}
                height={1672}
                priority
                sizes="(min-width: 640px) 384px, 352px"
              />
            </div>
            <Image
              src="/brand/mascote.svg"
              alt=""
              width={400}
              height={420}
              className="absolute -bottom-10 -left-14 w-36 -rotate-6 drop-shadow-xl sm:-left-20 sm:w-44"
            />
            <div className="absolute top-16 -right-3 flex items-center gap-3 rounded-2xl border border-line bg-card py-2.5 pr-4 pl-2.5 shadow-lift sm:-right-12">
              <span className="flex size-9 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                <Icon name="check" className="size-[18px]" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-bold">Vovó Ana confirmou</span>
                <span className="block text-muted">3 pessoas</span>
              </span>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-8 border-y border-line bg-card/60">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
            <h2 className="max-w-2xl font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">
              Pronto em três passos, do celular.
            </h2>
            <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <span className="font-display text-6xl leading-none font-semibold text-coral">{index + 1}</span>
                  <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <h2 className="font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">
              Para quem recebe, é só tocar.
            </h2>
            <ul className="mt-10 space-y-7">
              {GUEST.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-coral/10 text-coral">
                    <Icon name={item.icon} className="size-6" />
                  </span>
                  <span>
                    <span className="block text-lg font-bold">{item.title}</span>
                    <span className="mt-1 block text-muted">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel mx-auto w-full max-w-md">
            <p className="text-sm font-semibold text-muted">Aniversário da Helena</p>
            <p className="mt-1 font-display text-3xl font-semibold">8 pessoas confirmadas</p>
            <p className="mt-1 text-sm text-muted">Confirmações abertas até 07/03.</p>
            <ul className="mt-5 divide-y divide-line">
              {RSVPS.map((rsvp) => (
                <li key={rsvp.name} className="flex items-center gap-3 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-coral/10 font-bold text-coral">
                    {rsvp.name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1 font-medium">{rsvp.name}</span>
                  <span className="badge bg-sunken text-muted">
                    {rsvp.people} {rsvp.people === 1 ? "pessoa" : "pessoas"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">Você acompanha quem vem, em tempo real, pelo app.</p>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#1a1310] px-6 py-14 text-white sm:px-14 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(36rem_24rem_at_90%_10%,rgb(232_85_45/0.45),transparent_65%),radial-gradient(30rem_22rem_at_0%_100%,rgb(246_185_59/0.25),transparent_65%)]"
            />
            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                  O Nino já está de chapéu. E a sua festa?
                </h2>
                <p className="mt-4 max-w-lg text-lg text-white/75">
                  Crie a conta, escolha o tema e veja a prévia do convite antes de enviar para alguém.
                </p>
                <StartLink className="mt-8" />
              </div>
              <Image
                src="/brand/mascote.svg"
                alt="Nino, o envelope festeiro do Niver"
                width={400}
                height={420}
                className="mx-auto w-48 sm:w-56"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-6">
          <Logo className="text-lg" />
          <p>Convites de aniversário interativos.</p>
        </div>
      </footer>
    </div>
  );
}
