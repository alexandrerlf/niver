import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { deleteInvitation, publishInvitation, saveDetails } from "@/app/actions";
import { ActionButton } from "@/components/action-button";
import { DeleteInvitationButton } from "@/components/delete-invitation-button";
import { DetailsForm } from "@/components/details-form";
import { ShareLinks } from "@/components/share-links";
import { type Invitation } from "@/lib/invitation";
import { createClient } from "@/lib/supabase/server";

type Rsvp = { id: string; guest_name: string; party_size: number };

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("invitations").select("*").eq("id", id).maybeSingle();
  const invitation = data as Invitation | null;
  if (!invitation) notFound();

  const published = invitation.status === "published";
  const requestHeaders = await headers();
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const inviteUrl = `${protocol}://${requestHeaders.get("host")}/c/${invitation.slug}`;

  const { data: rsvpData } = await supabase
    .from("rsvps")
    .select("id, guest_name, party_size")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false });
  const rsvps = (rsvpData ?? []) as Rsvp[];
  const guests = rsvps.reduce((total, rsvp) => total + rsvp.party_size, 0);

  return (
    <main className="space-y-5">
      <h1 className="font-display text-3xl font-bold">{invitation.child_name}</h1>

      <section className="grid gap-5 sm:grid-cols-[280px_1fr]">
        <iframe
          key={invitation.updated_at}
          src={`/previa/convite/${invitation.id}`}
          title="Prévia do convite"
          sandbox="allow-scripts"
          className="mx-auto aspect-[9/16] w-full max-w-[280px] rounded-2xl border border-line bg-white"
        />
        <div className="space-y-5">
          {published ? (
            <>
              <div className="panel">
                <h2 className="mb-3 font-display text-xl font-bold">Compartilhar</h2>
                <ShareLinks url={inviteUrl} name={invitation.child_name} />
              </div>
              <div className="panel">
                <h2 className="font-display text-xl font-bold">Presenças</h2>
                <p className="mb-2 text-muted">
                  {guests === 0
                    ? "Ninguém confirmou ainda."
                    : `${guests} ${guests === 1 ? "pessoa confirmada" : "pessoas confirmadas"}`}
                </p>
                <ul className="divide-y divide-line">
                  {rsvps.map((rsvp) => (
                    <li key={rsvp.id} className="flex justify-between gap-3 py-2">
                      <span className="min-w-0 break-words">{rsvp.guest_name}</span>
                      <span className="shrink-0 font-bold">{rsvp.party_size}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="panel">
              <h2 className="font-display text-xl font-bold">Tudo certo?</h2>
              <p className="mb-4 text-muted">Ao publicar, o convite ganha um link para compartilhar.</p>
              <ActionButton
                action={publishInvitation.bind(null, invitation.id)}
                label="Publicar convite"
                pendingLabel="Publicando..."
              />
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <h2 className="font-display text-xl font-bold">Dados do convite</h2>
        <p className="mb-4 text-sm text-muted">
          {published
            ? "Ao salvar, o convite publicado é atualizado na hora."
            : "Estes textos aparecem no convite exatamente como estão aqui."}
        </p>
        <DetailsForm
          save={saveDetails.bind(null, invitation.id)}
          invitation={invitation}
          submitLabel="Salvar dados"
        />
      </section>

      <DeleteInvitationButton action={deleteInvitation.bind(null, invitation.id)} name={invitation.child_name} />
    </main>
  );
}
