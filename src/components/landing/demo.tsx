"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";

// Demonstração em telas reais do app: troca de passo sozinha e pode ser controlada pelo visitante.
const STEPS = [
  { id: "tema", title: "Escolha o tema", text: "Veja a prévia do convite antes de começar.", image: "/landing/demo-tema.webp" },
  { id: "dados", title: "Preencha a festa", text: "Nome, idade, data, horário e local. Leva um minuto.", image: "/landing/demo-dados.webp" },
  { id: "compartilhar", title: "Mande o link", text: "Copie ou envie direto pelo WhatsApp.", image: "/landing/demo-compartilhar.webp" },
  { id: "confirmacao", title: "Receba as confirmações", text: "O convidado responde no próprio convite, sem baixar nada.", image: "/landing/demo-confirmacao.webp" },
];

const DELAY = 4500;

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function Demo() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const autoplay = playing && !reducedMotion;

  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => setActive((current) => (current + 1) % STEPS.length), DELAY);
    return () => clearTimeout(timer);
  }, [active, autoplay]);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_18rem] lg:gap-16">
      <ol className="space-y-3">
        {STEPS.map((step, index) => {
          const current = index === active;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => {
                  setActive(index);
                  setPlaying(false);
                }}
                aria-current={current ? "step" : undefined}
                className={`relative flex w-full cursor-pointer items-start gap-4 overflow-hidden rounded-3xl p-5 text-left transition duration-300 ${
                  current ? "bg-white shadow-[0_12px_36px_-18px_rgb(41_27_67/0.35)]" : "hover:bg-white/60"
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-black transition duration-300 ${
                    current ? "bg-[#6636c3] text-white" : "bg-[#ece4fb] text-[#6636c3]"
                  }`}
                >
                  {index + 1}
                </span>
                <span>
                  <span className="block text-lg font-black text-[#291b43]">{step.title}</span>
                  <span className="mt-0.5 block text-[#5b4d80]">{step.text}</span>
                </span>
                {current && autoplay && (
                  <span
                    key={`progress-${active}`}
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[#16b8ad] [animation:demo-progress_linear_forwards]"
                    style={{ animationDuration: `${DELAY}ms` }}
                  />
                )}
              </button>
            </li>
          );
        })}
        <li className="pt-2 pl-5">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-extrabold text-[#4a1fa3] hover:bg-white/70"
          >
            <Icon name={autoplay ? "pause" : "play"} className="size-4" />
            {autoplay ? "Pausar demonstração" : "Passar sozinho"}
          </button>
        </li>
      </ol>

      <div className="mx-auto w-full max-w-[18rem] rounded-[2.6rem] bg-[#1d1630] p-2 shadow-[0_40px_80px_-30px_rgb(41_27_67/0.6)]">
        <div className="relative aspect-[390/844] overflow-hidden rounded-[2.1rem] bg-white">
          {STEPS.map((step, index) => (
            <Image
              key={step.id}
              src={step.image}
              alt={index === active ? `Tela do Niver: ${step.title.toLowerCase()}` : ""}
              aria-hidden={index !== active}
              fill
              sizes="280px"
              className={`object-cover object-top transition-opacity duration-500 ${index === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
