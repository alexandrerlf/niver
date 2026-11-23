import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Demo } from "@/components/landing/demo";

// Vitrine do Niver: a primeira tela de quem não está logado.
// Tem paleta e fonte próprias e não segue o tema escuro: as cores são fixas aqui.
const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "600", "800", "900"] });

const TRUST: { icon: IconName; text: string }[] = [
  { icon: "phone", text: "Convidado não baixa nada" },
  { icon: "clock", text: "Pronto em poucos minutos" },
  { icon: "message", text: "Feito para o WhatsApp" },
];

const FEATURES: { icon: IconName; title: string; text: string; tint: string }[] = [
  { icon: "users", title: "Confirmação de presença", text: "Cada convidado diz o nome e quantas pessoas vão. Você vê o total na hora.", tint: "bg-[#ece4fb] text-[#6636c3]" },
  { icon: "calendar", title: "Prazo para responder", text: "Defina até quando dá para confirmar e feche a lista com tranquilidade.", tint: "bg-[#fff3c8] text-[#9a7400]" },
  { icon: "pin", title: "Mapa em um toque", text: "O endereço da festa abre direto no mapa do celular do convidado.", tint: "bg-[#d6f4f1] text-[#0e8a82]" },
  { icon: "gift", title: "Sugestões de presente", text: "Deixe ideias como o tamanho da roupa ou do sapato, sem constrangimento.", tint: "bg-[#ffe3df] text-[#c2453a]" },
  { icon: "pencil", title: "Mudou algo? Edite", text: "Corrija horário ou local depois de enviar. O mesmo link já mostra o novo.", tint: "bg-[#ece4fb] text-[#6636c3]" },
  { icon: "sparkles", title: "Temas exclusivos", text: "Artes desenhadas para cada festa, com o nome e a idade no lugar certo.", tint: "bg-[#fff3c8] text-[#9a7400]" },
];

// Depoimentos de exemplo: aparecem só nas prévias, nunca em produção, até existirem depoimentos reais.
const TESTIMONIALS = [
  { name: "Mariana", context: "mãe da Alice, 5 anos", text: "Mandei no grupo da escola e em uma hora já sabia quantas crianças iam. Nunca foi tão fácil fechar a lista do buffet." },
  { name: "Rafael", context: "pai do Theo, 3 anos", text: "Os avós acharam lindo e conseguiram confirmar sozinhos. O mapa salvou quem não conhecia o salão." },
  { name: "Juliana", context: "mãe da Lara, 8 anos", text: "Precisei mudar o horário depois de enviar e não tive que mandar outro convite. Só corrigi e pronto." },
];

const FAQ = [
  { q: "Os convidados precisam instalar algum app ou criar conta?", a: "Não. O convite abre no navegador do celular, e a pessoa confirma presença ali mesmo, só com o nome e o número de pessoas." },
  { q: "Como eu envio o convite?", a: "Você recebe um link. Dá para enviar pelo WhatsApp com um toque, copiar para outros aplicativos ou mandar quantas vezes quiser." },
  { q: "Posso mudar a data, o horário ou o local depois de enviar?", a: "Pode. Você edita os dados no app e o mesmo link passa a mostrar as informações novas. Não precisa reenviar." },
  { q: "Como acompanho quem vai?", a: "No app aparece cada resposta com o nome e quantas pessoas vão, além do total confirmado." },
  { q: "Quem pode criar convites agora?", a: "O Niver está em lançamento e a criação de convites está liberada para contas convidadas. Crie sua conta e peça a liberação." },
];

function Cta({ className = "", tone = "purple", children = "Criar meu convite" }: { className?: string; tone?: "purple" | "yellow"; children?: string }) {
  const colors =
    tone === "purple"
      ? "bg-[#6636c3] text-white hover:bg-[#5527b0] shadow-[0_10px_24px_-10px_rgb(102_54_195/0.7)]"
      : "bg-[#ffd34e] text-[#291b43] hover:bg-[#ffc824] shadow-[0_10px_24px_-10px_rgb(0_0_0/0.4)]";
  return (
    <Link
      href="/login"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-extrabold whitespace-nowrap transition duration-200 active:scale-[0.97] ${colors} ${className}`}
    >
      {children}
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

function SectionTitle({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl leading-tight font-black text-balance text-[#3d1a8f] sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-lg font-semibold text-pretty text-[#5b4d80]">{text}</p>}
    </div>
  );
}

export function LandingPage({ showPlaceholders = false }: { showPlaceholders?: boolean }) {
  return (
    <div className={`${nunito.className} min-h-dvh overflow-x-clip bg-[#fbfaff] pb-24 text-[#291b43] sm:pb-0`}>
      <div className="relative bg-[linear-gradient(180deg,#e9f4ff_0%,#d6ecff_55%,#c9ecc0_100%)]">
        <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-12 w-full sm:h-20">
          <path d="M0 40 C240 90 480 0 720 30 C960 60 1200 10 1440 40 L1440 80 L0 80 Z" fill="#fbfaff" />
        </svg>

        <header className="relative mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Wordmark size="text-2xl sm:text-3xl" />
          <nav aria-label="Seções" className="hidden items-center gap-1 font-extrabold text-[#4a1fa3] lg:flex">
            <a href="#como-funciona" className="rounded-full px-4 py-2.5 hover:bg-white/60">Como funciona</a>
            <a href="#recursos" className="rounded-full px-4 py-2.5 hover:bg-white/60">Recursos</a>
            <a href="#duvidas" className="rounded-full px-4 py-2.5 hover:bg-white/60">Dúvidas</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="inline-flex min-h-11 items-center rounded-full px-4 font-extrabold text-[#4a1fa3] hover:bg-white/60">
              Entrar
            </Link>
            <span className="hidden sm:block">
              <Cta>Criar conta</Cta>
            </span>
          </div>
        </header>

        <section className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pt-4 pb-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:pb-28">
          <div>
            <h1 className="text-4xl leading-[1.05] font-black tracking-tight text-[#3d1a8f] text-balance sm:text-6xl">
              Convite de aniversário infantil do jeitinho que as crianças amam!
            </h1>
            <p className="mt-5 max-w-lg text-lg font-semibold text-[#3b2f5c] sm:text-xl">
              Crie convites interativos, escolha um tema e deixe os convidados confirmarem presença pelo próprio link.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Cta />
              <a href="#como-funciona" className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-extrabold text-[#4a1fa3] hover:bg-white/60">
                <Icon name="play" className="size-4" />
                Ver como funciona
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#3b2f5c]">
              {TRUST.map((item) => (
                <li key={item.text} className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/80 text-[#0e8a82]">
                    <Icon name={item.icon} className="size-4" />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
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
        <section id="como-funciona" className="scroll-mt-6 bg-[#f4f0fd]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
            <SectionTitle title="Veja como funciona" text="Do tema à primeira confirmação, em quatro passos. Estas são telas reais do Niver." />
            <div className="mt-12">
              <Demo />
            </div>
          </div>
        </section>

        <section id="recursos" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-20 sm:px-6 lg:py-24">
          <SectionTitle title="Tudo o que a festa precisa, num link só" text="Menos mensagem perdida no grupo, mais tempo para pensar no bolo." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_-16px_rgb(41_27_67/0.25)]">
                <span className={`flex size-12 items-center justify-center rounded-2xl ${feature.tint}`}>
                  <Icon name={feature.icon} className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                <p className="mt-1 text-[#5b4d80]">{feature.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-20 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#f1ecfc] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-[#3d1a8f] sm:text-3xl">E o convidado, o que faz?</h2>
            <p className="mt-1 text-lg font-semibold text-[#5b4d80]">É simples e rápido!</p>
            <ul className="mt-6 space-y-4">
              {["Confirma presença com o nome e quantas pessoas vão", "Abre o mapa do local da festa", "Vê as sugestões de presente"].map((text) => (
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
                  <span className="text-sm text-[#5b4d80]">Respostas</span>
                </span>
              </div>
              <div className="flex items-center gap-3 pl-4">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#d6f4f1] text-[#0e8a82]">
                  <Icon name="users" className="size-6" />
                </span>
                <span>
                  <span className="block text-3xl font-black">28</span>
                  <span className="text-sm text-[#5b4d80]">Pessoas confirmadas</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {showPlaceholders && (
          <section aria-labelledby="depoimentos" className="bg-[#f4f0fd]">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
              <p className="mx-auto mb-4 w-fit rounded-full bg-[#ffe3df] px-3 py-1 text-center text-sm font-extrabold text-[#9c2f25]">
                Depoimentos de exemplo: só aparecem nas prévias, não em produção
              </p>
              <h2 id="depoimentos" className="text-center text-3xl font-black text-[#3d1a8f] sm:text-4xl">
                Quem já fez a festa com o Niver
              </h2>
              <ul className="mt-12 grid gap-4 md:grid-cols-3">
                {TESTIMONIALS.map((item) => (
                  <li key={item.name} className="flex flex-col rounded-3xl bg-white p-6 shadow-[0_8px_30px_-16px_rgb(41_27_67/0.25)]">
                    <span className="flex gap-0.5 text-[#f2b600]" role="img" aria-label="5 de 5 estrelas">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Icon key={star} name="star" className="size-5 fill-current" />
                      ))}
                    </span>
                    <p className="mt-4 flex-1 text-lg">“{item.text}”</p>
                    <p className="mt-5 font-black">
                      {item.name} <span className="font-semibold text-[#5b4d80]">· {item.context}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section id="duvidas" className="mx-auto max-w-3xl scroll-mt-6 px-4 py-20 sm:px-6 lg:py-24">
          <SectionTitle title="Perguntas frequentes" />
          <div className="mt-10 space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-2xl bg-white shadow-[0_8px_30px_-18px_rgb(41_27_67/0.3)] open:shadow-[0_12px_36px_-18px_rgb(41_27_67/0.4)]">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-lg font-black [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Icon name="chevronDown" className="size-5 shrink-0 text-[#6636c3] transition duration-200 group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-[#5b4d80]">{item.a}</p>
              </details>
            ))}
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <Wordmark size="text-xl" />
          <nav aria-label="Rodapé" className="flex flex-wrap items-center gap-1 font-extrabold text-[#4a1fa3]">
            <a href="#como-funciona" className="rounded-full px-3 py-2 hover:bg-[#f1ecfc]">Como funciona</a>
            <a href="#duvidas" className="rounded-full px-3 py-2 hover:bg-[#f1ecfc]">Dúvidas</a>
            <Link href="/privacidade" className="rounded-full px-3 py-2 hover:bg-[#f1ecfc]">Privacidade</Link>
            <Link href="/termos" className="rounded-full px-3 py-2 hover:bg-[#f1ecfc]">Termos</Link>
            <Link href="/login" className="rounded-full px-3 py-2 hover:bg-[#f1ecfc]">Entrar</Link>
          </nav>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e6def8] bg-white/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
        <Cta className="w-full" />
      </div>
    </div>
  );
}
