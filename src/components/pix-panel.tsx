"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { checkPixCharge, publishCourtesy, requestPixCharge, type PixCharge } from "@/app/billing-actions";
import { ErrorMessage, NoticeMessage } from "@/components/form-feedback";
import { Icon, Spinner } from "@/components/icons";

const POLL_MS = 4000;

// Publicar ou reativar o convite: mostra o preço e a validade, gera o Pix e espera o pagamento cair.
export function PixPanel({
  invitationId,
  price,
  lastDay,
  reactivate = false,
  admin = false,
}: {
  invitationId: string;
  price: string;
  lastDay: string;
  reactivate?: boolean;
  admin?: boolean;
}) {
  const router = useRouter();
  const [charge, setCharge] = useState<PixCharge | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const status = charge?.status ?? null;

  // Pergunta pela cobrança até o pagamento cair, vencer ou falhar.
  // Depois de pago, mostra a confirmação e só então recarrega o convite no ar.
  useEffect(() => {
    if (status !== "paid") return;
    const timer = setTimeout(() => router.refresh(), 3000);
    return () => clearTimeout(timer);
  }, [status, router]);

  useEffect(() => {
    if (!charge || charge.status !== "pending") return;
    const timer = setInterval(async () => {
      const result = await checkPixCharge(charge.id);
      if (result.status === charge.status) return;
      setCharge({ ...charge, status: result.status });
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [charge, router]);

  function generate() {
    setError("");
    start(async () => {
      const result = await requestPixCharge(invitationId);
      if ("error" in result) setError(result.error);
      else setCharge(result.charge);
    });
  }

  function courtesy() {
    setError("");
    start(async () => {
      const result = await publishCourtesy(invitationId);
      if (result.error) setError(result.error);
      else {
        setNotice(result.notice ?? "");
        router.refresh();
      }
    });
  }

  async function copy() {
    if (!charge) return;
    try {
      await navigator.clipboard.writeText(charge.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar. Toque e segure no código acima para copiar.");
    }
  }

  const action = reactivate ? "Reativar" : "Publicar";

  if (status === "paid") {
    return (
      <div className="panel border-leaf/40">
        <NoticeMessage>{reactivate ? "Pagamento confirmado. O convite voltou ao ar." : "Pagamento confirmado. O convite está no ar."}</NoticeMessage>
      </div>
    );
  }

  return (
    <div className="panel border-brand/30 bg-linear-to-br from-brand/10 to-sun/10">
      <h2 className="section-title">{reactivate ? "Colocar de volta no ar" : "Tudo certo?"}</h2>
      <p className="mt-1 text-muted">
        {reactivate
          ? "Pague o Pix e o mesmo link volta a funcionar."
          : "Confira a prévia. Ao publicar, o convite ganha um link para compartilhar."}
      </p>
      <p className="mt-3 font-semibold">
        Fica no ar até {lastDay}. Compartilhe o link quantas vezes quiser.
      </p>

      {charge && status === "pending" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
          {/* QR code vem pronto do Mercado Pago, em base64. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${charge.qrBase64}`}
            alt="QR code do Pix"
            width={176}
            height={176}
            className="mx-auto size-44 rounded-2xl border border-line bg-white p-2"
          />
          <div className="min-w-0">
            <p className="text-sm text-muted">
              No app do seu banco, escolha Pix e leia o QR code, ou copie o código e use o Pix copia e cola.
            </p>
            <p className="mt-3 truncate rounded-2xl border border-line bg-card px-4 py-3 font-mono text-sm select-all" title={charge.pixCode}>
              {charge.pixCode}
            </p>
            <button type="button" className="button-secondary mt-3 w-full sm:w-auto" onClick={copy}>
              <Icon name={copied ? "check" : "copy"} className="size-[18px]" />
              {copied ? "Código copiado" : "Copiar código Pix"}
            </button>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted" role="status">
              <Spinner />
              Esperando o pagamento…
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="button-primary" disabled={pending} onClick={generate}>
            {pending ? <Spinner /> : <Icon name="sparkles" className="size-[18px]" />}
            {pending ? "Gerando Pix…" : `${action} por ${price}`}
          </button>
          {admin && (
            <button type="button" className="button-secondary" disabled={pending} onClick={courtesy}>
              {action} sem cobrar
            </button>
          )}
        </div>
      )}

      {status === "expired" && (
        <ErrorMessage className="mt-4">O Pix venceu sem pagamento. Gere um novo para continuar.</ErrorMessage>
      )}
      {status === "failed" && <ErrorMessage className="mt-4">Não foi possível confirmar o Pix. Gere um novo.</ErrorMessage>}
      {error && <ErrorMessage className="mt-4">{error}</ErrorMessage>}
      {notice && <NoticeMessage className="mt-4">{notice}</NoticeMessage>}
    </div>
  );
}
