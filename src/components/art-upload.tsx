"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import type { FormState } from "@/app/actions";
import { ART_BUCKET, ART_TYPES, MAX_ART_BYTES } from "@/lib/invitation";
import { createClient } from "@/lib/supabase/browser";

// O arquivo vai direto para o Storage: rotas na Vercel recusam corpos acima de 4,5 MB.
export function ArtUpload({
  folder,
  save,
  label,
}: {
  folder: string;
  save: (path: string) => Promise<FormState>;
  label: string;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const extension = ART_TYPES[file.type];
    if (!extension) return setError("Use uma imagem JPG, PNG ou WebP.");
    if (file.size > MAX_ART_BYTES) return setError("A imagem precisa ter até 8 MB.");

    setError("");
    setBusy(true);
    try {
      const path = `${folder}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await createClient()
        .storage.from(ART_BUCKET)
        .upload(path, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      const result = await save(path);
      if (result.error) throw new Error(result.error);
      router.refresh();
    } catch (cause) {
      console.error("art upload", cause);
      setError(cause instanceof Error ? cause.message : "Não foi possível enviar a imagem.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={input}
        className="sr-only"
        type="file"
        accept={Object.keys(ART_TYPES).join(",")}
        onChange={upload}
        aria-label={label}
        tabIndex={-1}
      />
      <button
        type="button"
        className="button-secondary"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        {busy ? "Enviando..." : label}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
