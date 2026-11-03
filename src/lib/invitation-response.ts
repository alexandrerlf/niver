import { randomBytes } from "node:crypto";
import type { PublicInvitation } from "@/lib/invitation";
import { invitationCsp, renderInvitation } from "@/lib/render";

export function invitationResponse(
  invitation: PublicInvitation,
  artUrl: string,
  request: Request,
  preview = false,
) {
  const { origin, href } = new URL(request.url);
  const nonce = randomBytes(16).toString("base64");

  return new Response(
    renderInvitation(invitation, { artUrl, appOrigin: origin, pageUrl: href, nonce, preview }),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": invitationCsp({ artUrl, appOrigin: origin, nonce }),
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
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
