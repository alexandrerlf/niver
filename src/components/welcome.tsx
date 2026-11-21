"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { completeTutorial } from "@/app/actions";
import { Icon } from "@/components/icons";
import { installPromptKind, isIos } from "@/lib/install-prompt";

// Boas-vindas do cliente logado: o tutorial na primeira visita e, depois dele, o aviso para instalar o app.

const KEYS = {
  tutorial: "niver:tutorial-visto",
  installed: "niver:app-instalado",
  dismissed: "niver:instalacao-fechada-em",
};

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Navegação privada ou armazenamento bloqueado: o aviso só volta a aparecer.
  }
}

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

const listeners = new Set<() => void>();
let reopened = false;
let installEvent: InstallEvent | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// O navegador avisa que dá para instalar logo no carregamento, às vezes antes do componente montar.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installEvent = event as InstallEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installEvent = null;
    write(KEYS.installed, "1");
    emit();
  });
}

// "Rever tutorial", em Minha conta.
export function openTutorial() {
  reopened = true;
  emit();
}

const STEPS = [
  {
    title: "Escolha o tema",
    text: "No catálogo, veja a prévia de cada modelo e escolha o da festa.",
    image: "/landing/demo-tema.webp",
  },
  {
    title: "Preencha a festa",
    text: "Nome, idade, data, horário e local. Dá para mudar tudo depois.",
    image: "/landing/demo-dados.webp",
  },
  {
    title: "Publique e mande o link",
    text: "Com o convite no ar, envie pelo WhatsApp ou copie o link.",
    image: "/landing/demo-compartilhar.webp",
  },
  {
    title: "Acompanhe as presenças",
    text: "Cada convidado confirma no próprio convite e aparece na sua lista.",
    image: "/landing/demo-confirmacao.webp",
  },
];

export function Welcome({ onboarded, raised = false }: { onboarded: boolean; raised?: boolean }) {
  // No servidor, considera tudo visto: nada aparece antes de o navegador conferir.
  const seenHere = useSyncExternalStore(subscribe, () => read(KEYS.tutorial) !== null, () => true);
  const forced = useSyncExternalStore(subscribe, () => reopened, () => false);
  const tutorialOpen = forced || (!onboarded && !seenHere);
  const [, startSaving] = useTransition();

  function finishTutorial() {
    write(KEYS.tutorial, new Date().toISOString());
    reopened = false;
    emit();
    if (!onboarded) startSaving(() => completeTutorial());
  }

  return tutorialOpen ? (
    <Tutorial onFinish={finishTutorial} />
  ) : (
    <InstallPrompt tutorialDone={onboarded || seenHere} raised={raised} />
  );
}

function Tutorial({ onFinish }: { onFinish: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    // O foco começa no botão de avançar, não em "Pular".
    next.current?.focus();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      // Esc fecha como "Pular".
      onCancel={(event) => {
        event.preventDefault();
        onFinish();
      }}
      className="m-auto w-[min(92vw,28rem)] overflow-visible overscroll-contain rounded-[2rem] border border-line bg-card p-0 text-ink shadow-lift backdrop:bg-ink/55 backdrop:backdrop-blur-sm open:animate-rise"
    >
      <Image
        src="/brand/b/leao-cabeca.png"
        alt=""
        width={512}
        height={512}
        priority
        className="pointer-events-none absolute -top-11 left-5 size-20 drop-shadow-[0_8px_14px_rgb(41_27_67/0.25)] sm:-top-12 sm:size-24"
      />
      <button
        type="button"
        onClick={onFinish}
        className="absolute top-3 right-3 min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-muted transition duration-200 hover:bg-ink/5 hover:text-ink"
      >
        Pular
      </button>

      <div className="relative mx-4 mt-14 h-52 overflow-hidden rounded-3xl bg-sunken sm:h-60">
        <div className="absolute inset-x-0 top-5 mx-auto w-44 overflow-hidden rounded-t-[1.6rem] border-[6px] border-b-0 border-[#1d1630] bg-white sm:w-52">
          {STEPS.map((item, position) => (
            <Image
              key={item.image}
              src={item.image}
              alt=""
              width={390}
              height={844}
              sizes="208px"
              className={`w-full transition-opacity duration-300 ${position === index ? "opacity-100" : "absolute inset-0 opacity-0"}`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 pb-6 sm:px-7">
        <p className="text-sm font-semibold text-muted">
          Passo {index + 1} de {STEPS.length}
        </p>
        {index === 0 && <p className="mt-3 font-semibold text-brand">Oi, eu sou o Leo. Vou te mostrar como funciona.</p>}
        <h2 id={titleId} className="section-title mt-2">
          {step.title}
        </h2>
        <p className="mt-2 text-muted" aria-live="polite">
          {step.text}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            {STEPS.map((item, position) => (
              <span
                key={item.title}
                className={`h-2 rounded-full transition-[width,background-color] duration-300 ${position === index ? "w-6 bg-brand" : "w-2 bg-line"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {index > 0 && (
              <button type="button" className="button-secondary" onClick={() => setIndex(index - 1)}>
                Voltar
              </button>
            )}
            <button
              type="button"
              ref={next}
              className="button-primary"
              onClick={() => (last ? onFinish() : setIndex(index + 1))}
            >
              {last ? "Começar" : "Próximo"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function standalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function InstallPrompt({ tutorialDone, raised }: { tutorialDone: boolean; raised: boolean }) {
  const titleId = useId();
  const kind = useSyncExternalStore(
    subscribe,
    () => {
      const dismissed = Number(read(KEYS.dismissed));
      return installPromptKind({
        tutorialDone,
        standalone: standalone(),
        installed: read(KEYS.installed) !== null,
        dismissedAt: dismissed > 0 ? dismissed : null,
        canPrompt: installEvent !== null,
        ios: isIos(navigator.userAgent, navigator.maxTouchPoints),
        now: Date.now(),
      });
    },
    () => null,
  );
  if (!kind) return null;

  function dismiss() {
    write(KEYS.dismissed, String(Date.now()));
    emit();
  }

  async function install() {
    const event = installEvent;
    if (!event) return;
    installEvent = null;
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      write(outcome === "accepted" ? KEYS.installed : KEYS.dismissed, outcome === "accepted" ? "1" : String(Date.now()));
    } catch {
      // O navegador recusou abrir a instalação: trata como fechado.
      write(KEYS.dismissed, String(Date.now()));
    }
    emit();
  }

  return (
    <aside
      aria-labelledby={titleId}
      className={`fixed inset-x-3 z-40 animate-rise rounded-3xl border border-line bg-card p-4 text-ink shadow-lift sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem] ${
        raised ? "bottom-24" : "bottom-[max(0.75rem,env(safe-area-inset-bottom))]"
      }`}
    >
      <div className="flex items-start gap-3">
        <Image src="/icons/icon-192.png" alt="" width={192} height={192} className="size-12 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="font-display text-lg leading-tight font-extrabold">
            Tenha o Niver na tela inicial
          </h2>
          {kind === "prompt" ? (
            <p className="mt-1 text-sm text-muted">Abre como um app, sem passar pelo navegador.</p>
          ) : (
            <p className="mt-1 text-sm text-muted">
              Toque em <Icon name="share" className="inline size-4 align-[-3px] text-brand" />{" "}
              <strong className="font-semibold text-ink">Compartilhar</strong> e depois em{" "}
              <strong className="font-semibold text-ink">Adicionar à Tela de Início</strong>.
            </p>
          )}
        </div>
        <button type="button" className="icon-button -mt-2 -mr-2" aria-label="Fechar aviso de instalação" onClick={dismiss}>
          <Icon name="close" className="size-5" />
        </button>
      </div>
      {kind === "prompt" && (
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" className="button-secondary" onClick={dismiss}>
            Agora não
          </button>
          <button type="button" className="button-primary" onClick={install}>
            <Icon name="download" className="size-[18px]" />
            Instalar
          </button>
        </div>
      )}
    </aside>
  );
}
