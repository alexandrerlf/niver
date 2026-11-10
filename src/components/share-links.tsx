"use client";

import { useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";

const noop = () => () => {};

export function ShareLinks({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState(false);
  // O compartilhamento nativo só existe em alguns navegadores, e nunca no servidor.
  const canShare = useSyncExternalStore(
    noop,
    () => typeof navigator.share === "function",
    () => false,
  );
  const text = `Você é nosso convidado no aniversário de ${name}! Veja o convite: ${url}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function share() {
    try {
      await navigator.share({ title: `Aniversário de ${name}`, text, url });
    } catch {
      // A pessoa fechou a folha de compartilhamento.
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 rounded-2xl border border-line bg-sunken py-1 pr-1 pl-4">
        <p className="min-w-0 flex-1 truncate text-sm font-medium" title={url}>
          {url.replace(/^https?:\/\//, "")}
        </p>
        <button
          type="button"
          onClick={copy}
          className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition duration-200 ${
            copied ? "bg-leaf/15 text-leaf" : "bg-card text-ink shadow-soft hover:text-coral"
          }`}
        >
          <Icon name={copied ? "check" : "copy"} className="size-4" />
          <span aria-live="polite">{copied ? "Copiado" : "Copiar"}</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          className="button-primary flex-1"
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener"
        >
          <Icon name="message" className="size-[18px]" />
          Enviar no WhatsApp
        </a>
        {canShare && (
          <button type="button" className="button-secondary flex-1" onClick={share}>
            <Icon name="share" className="size-[18px]" />
            Compartilhar
          </button>
        )}
        <a className="button-secondary flex-1" href={url} target="_blank" rel="noopener">
          <Icon name="external" className="size-[18px]" />
          Abrir convite
        </a>
      </div>
    </div>
  );
}
