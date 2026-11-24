import { randomBytes } from "node:crypto";
import type { PublicInvitation } from "@/lib/invitation";
import { type InvitationMark, invitationCsp, renderInvitation } from "@/lib/render";

export function invitationResponse(
  invitation: PublicInvitation,
  artUrl: string,
  request: Request,
  preview = false,
  mark: InvitationMark | null = null,
) {
  const { origin, href } = new URL(request.url);
  const nonce = randomBytes(16).toString("base64");

  return new Response(
    renderInvitation(invitation, { artUrl, appOrigin: origin, pageUrl: href, nonce, preview, mark }),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": invitationCsp({ artUrl, appOrigin: origin, nonce }),
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        // Convite de criança não aparece em buscadores.
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-cache",
      },
    },
  );
}

export function notFoundResponse(message: string) {
  return new Response(message, {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Link de convite arquivado ou vencido: avisa o convidado sem mostrar os dados da festa.
export function closedResponse() {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Convite encerrado</title>
<style>body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;box-sizing:border-box;background:#fbfaff;color:#291b43;font-family:system-ui,sans-serif;text-align:center}h1{margin:0 0 8px;font-size:28px;line-height:1.15}p{margin:0;color:#5b4d80}</style>
</head><body><main><h1>Este convite foi encerrado</h1><p>O prazo deste convite terminou.</p></main></body></html>`;
  return new Response(html, {
    status: 410,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-cache",
    },
  });
}
