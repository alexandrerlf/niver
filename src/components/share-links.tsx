"use client";

import { useState } from "react";

export function ShareLinks({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const text = `Você é nosso convidado no aniversário de ${name}! Veja o convite: ${url}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      <p className="break-all text-sm text-muted">{url}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button className="button-secondary" onClick={copy}>
          {copied ? "Link copiado" : "Copiar link"}
        </button>
        <a
          className="button-primary"
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener"
        >
          Enviar no WhatsApp
        </a>
      </div>
    </div>
  );
}
