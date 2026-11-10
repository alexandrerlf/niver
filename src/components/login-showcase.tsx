import { Icon } from "@/components/icons";

const CARDS = [
  {
    name: "Lia",
    line: "faz 6 anos",
    when: "Sáb, 14 de março · 15h",
    className: "left-0 top-16 -rotate-[9deg] from-[#1d6fa5] via-[#2a9bc4] to-[#7fd6d2] [animation-delay:-2s]",
  },
  {
    name: "Theo",
    line: "faz 4 anos",
    when: "Dom, 22 de março · 10h",
    className: "left-1/2 top-0 z-10 -translate-x-1/2 from-[#e8552d] via-[#f58a3c] to-[#f6b93b]",
  },
  {
    name: "Nina",
    line: "faz 8 anos",
    when: "Sex, 3 de abril · 18h",
    className: "right-0 top-20 rotate-[8deg] from-[#3b2a78] via-[#6b3fa0] to-[#d15c9c] [animation-delay:-4s]",
  },
];

// Convites de mentira, desenhados em CSS, para a vitrine não depender de nenhuma arte.
function MockInvitation({ name, line, when, className }: (typeof CARDS)[number]) {
  return (
    <div
      className={`absolute flex aspect-[9/14] w-[46%] animate-float flex-col items-center overflow-hidden rounded-[1.6rem] bg-linear-to-b p-4 text-center text-white shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ring-1 ring-white/20 ${className}`}
    >
      <span className="absolute -top-6 -left-6 size-20 rounded-full bg-white/15" />
      <span className="absolute top-10 -right-4 size-12 rounded-full bg-white/10" />
      <span className="absolute bottom-16 -left-3 size-8 rounded-full bg-white/15" />
      <span className="mt-[18%] text-[0.6rem] font-bold tracking-[0.2em] uppercase opacity-80">Você é meu convidado</span>
      <span className="mt-3 font-display text-4xl leading-none font-semibold xl:text-5xl">{name}</span>
      <span className="mt-1 font-display text-lg italic opacity-90">{line}</span>
      <span className="mt-auto text-[0.65rem] font-semibold opacity-90">{when}</span>
      <span className="mt-2.5 w-full rounded-full bg-white py-2 text-[0.7rem] font-bold text-black/80">
        Confirmar presença
      </span>
    </div>
  );
}

export function LoginShowcase() {
  return (
    <aside className="relative hidden overflow-hidden rounded-[2.5rem] bg-[#1a1310] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(40rem_28rem_at_85%_0%,rgb(232_85_45/0.45),transparent_65%),radial-gradient(34rem_26rem_at_0%_100%,rgb(246_185_59/0.28),transparent_65%)]"
      />

      <div aria-hidden="true" className="relative mx-auto mt-6 aspect-[10/9] w-full max-w-md">
        {CARDS.map((card) => (
          <MockInvitation key={card.name} {...card} />
        ))}
        <div className="absolute -right-2 bottom-2 z-20 flex animate-float items-center gap-3 rounded-2xl bg-white/95 py-2.5 pr-4 pl-2.5 text-[#1f1611] shadow-[0_20px_40px_-12px_rgb(0_0_0/0.6)] [animation-delay:-1s]">
          <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" className="size-[18px]" />
          </span>
          <span className="text-sm leading-tight">
            <span className="block font-bold">Vovó Ana confirmou</span>
            <span className="block text-[#6b5d53]">3 pessoas</span>
          </span>
        </div>
      </div>

      <div className="relative">
        <p className="font-display text-4xl leading-[1.1] font-semibold text-balance xl:text-5xl">
          Do modelo ao <em className="text-[#ffb08f]">“eu vou!”</em> em poucos minutos.
        </p>
        <ul className="mt-8 grid gap-3 text-white/80">
          {[
            ["sparkles", "Modelos prontos, com o nome e os dados da sua festa"],
            ["share", "Um link para enviar no WhatsApp"],
            ["users", "Lista de presenças atualizada na hora"],
          ].map(([icon, text]) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-[#ffb08f]">
                <Icon name={icon as "sparkles"} className="size-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
