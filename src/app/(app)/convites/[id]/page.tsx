import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { deleteInvitation, saveDetails } from "@/app/actions";
import { BackLink } from "@/components/back-link";
import { DeleteInvitationButton } from "@/components/delete-invitation-button";
import { DetailsForm } from "@/components/details-form";
import { Icon, type IconName } from "@/components/icons";
import { PixPanel } from "@/components/pix-panel";
import { ShareLinks } from "@/components/share-links";
import { Stepper } from "@/components/stepper";
import { countdownLabel, daysUntil, isPast } from "@/lib/countdown";
import { type Invitation } from "@/lib/invitation";
import { PRICE_CENTS, formatPrice, lastActiveDay, lastDayOf } from "@/lib/pricing";
import { formatDate, formatDateShort, formatTime } from "@/lib/render";
import { createClient, getUserId } from "@/lib/supabase/server";

type Rsvp = { id: string; guest_name: string; party_size: number };

function Stat({ icon, value, label }: { icon: IconName; value: string | number; label: string }) {
  return (
    <div className="rounded-3xl border border-line bg-card p-4 shadow-soft sm:p-5">
      <Icon name={icon} className="size-5 text-brand" />
      <p className="mt-3 font-display text-3xl leading-none font-semibold sm:text-4xl">{value}</p>
      <p className="mt-1.5 text-sm text-muted">{label}</p>
    </div>
  );
}

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  // O banco deixa qualquer conta ler convites publicados: esta tela é só do dono.
  const userId = await getUserId(supabase);
  const { data } = await supabase.from("invitations").select("*").eq("id", id).eq("owner_id", userId).maybeSingle();
  const invitation = data as Invitation | null;
  if (!invitation) notFound();

  // Publicado e dentro da validade; vencido ou arquivado vira histórico, só para leitura.
  const expired =
    invitation.status === "archived" ||
    (invitation.status === "published" &&
      invitation.expires_at !== null &&
      Date.parse(invitation.expires_at) <= Date.now());
  const published = invitation.status === "published" && !expired;
  const draft = invitation.status === "draft";
  const { data: isAdmin } = await supabase.rpc("is_admin");
  const price = formatPrice(PRICE_CENTS);
  const nextLastDay = formatDateShort(lastActiveDay(invitation.event_date, new Date()));
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
  const days = daysUntil(invitation.event_date);
  const details = [
    { icon: "calendar" as const, text: formatDate(invitation.event_date) },
    { icon: "pin" as const, text: invitation.location_name },
  ].filter((detail) => detail.text);
  const time = formatTime(invitation.event_time);

  return (
    <main>
      <div className="mb-8 animate-rise sm:mb-10">
        <BackLink href="/convites">Convites</BackLink>
        {draft && (
          <div className="mt-3">
            <Stepper current={2} />
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {published ? (
            <span className="badge bg-leaf/12 text-leaf">
              <span className="badge-dot" />
              No ar
            </span>
          ) : expired ? (
            <span className="badge bg-sunken text-muted">
              <span className="badge-dot" />
              Encerrado
            </span>
          ) : (
            <span className="badge bg-sun/25 text-ink">
              <span className="badge-dot text-sun" />
              Rascunho
            </span>
          )}
          {days !== null && !expired && <span className="badge bg-sunken text-muted">{countdownLabel(days)}</span>}
        </div>
        <h1 className="page-title mt-3 break-words">{invitation.child_name || "Sem nome"}</h1>
        {details.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-muted">
            {details.map((detail, index) => (
              <li key={detail.icon} className="flex items-center gap-2">
                <Icon name={detail.icon} className="size-[18px]" />
                <span className="first-letter:uppercase">
                  {detail.text}
                  {index === 0 && time && ` às ${time}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="grid animate-rise items-start gap-8 lg:grid-cols-[290px_1fr] lg:gap-12">
        <figure className="lg:sticky lg:top-24">
          <div className="phone">
            <iframe
              key={invitation.updated_at}
              src={`/previa/convite/${invitation.id}`}
              title="Prévia do convite"
              sandbox="allow-scripts"
            />
          </div>
          <figcaption className="mt-4 text-center text-sm text-muted">
            {published ? "Como os convidados veem" : expired ? "Convite encerrado" : "Prévia do convite"}
          </figcaption>
        </figure>

        <div className="min-w-0 space-y-6">
          {published ? (
            <>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <Stat icon="users" value={guests} label={guests === 1 ? "pessoa confirmada" : "pessoas confirmadas"} />
                <Stat icon="mail" value={rsvps.length} label={rsvps.length === 1 ? "resposta" : "respostas"} />
                <Stat
                  icon="cake"
                  value={days === null || days < 0 ? "–" : days}
                  label={days === 1 ? "dia para a festa" : "dias para a festa"}
                />
              </div>

              <div className="panel">
                <h2 className="section-title">Compartilhar</h2>
                <p className="mt-1 text-muted">Envie o link. Os convidados confirmam presença no próprio convite.</p>
                {invitation.expires_at && (
                  <p className="mt-2 mb-5 font-semibold">
                    Ativo até {formatDateShort(lastDayOf(invitation.expires_at))}. Compartilhe o link quantas vezes
                    quiser.
                  </p>
                )}
                <ShareLinks url={inviteUrl} name={invitation.child_name} />
              </div>

              <div className="panel">
                <h2 className="section-title">Presenças</h2>
                {invitation.rsvp_deadline && (
                  <p className="mt-1 text-sm font-semibold text-muted">
                    {isPast(invitation.rsvp_deadline)
                      ? `Confirmações encerradas em ${formatDateShort(invitation.rsvp_deadline)}.`
                      : `Confirmações abertas até ${formatDateShort(invitation.rsvp_deadline)}.`}
                  </p>
                )}
                {rsvps.length === 0 ? (
                  <p className="mt-1 text-muted">
                    Ninguém confirmou ainda. As respostas aparecem aqui assim que chegarem.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-line">
                    {rsvps.map((rsvp) => (
                      <li key={rsvp.id} className="flex items-center gap-3 py-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 font-bold text-brand uppercase">
                          {rsvp.guest_name.trim().charAt(0) || "?"}
                        </span>
                        <span className="min-w-0 flex-1 font-medium break-words">{rsvp.guest_name}</span>
                        <span className="badge shrink-0 bg-sunken text-muted">
                          {rsvp.party_size} {rsvp.party_size === 1 ? "pessoa" : "pessoas"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <>
              {expired && (
                <div className="panel">
                  <h2 className="section-title">Presenças</h2>
                  {rsvps.length === 0 ? (
                    <p className="mt-1 text-muted">Ninguém confirmou presença neste convite.</p>
                  ) : (
                    <>
                      <p className="mt-1 text-sm font-semibold text-muted">
                        {guests} {guests === 1 ? "pessoa confirmada" : "pessoas confirmadas"}
                      </p>
                      <ul className="mt-3 divide-y divide-line">
                        {rsvps.map((rsvp) => (
                          <li key={rsvp.id} className="flex items-center gap-3 py-3">
                            <span className="min-w-0 flex-1 font-medium break-words">{rsvp.guest_name}</span>
                            <span className="badge shrink-0 bg-sunken text-muted">
                              {rsvp.party_size} {rsvp.party_size === 1 ? "pessoa" : "pessoas"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
              <PixPanel
                invitationId={invitation.id}
                price={price}
                lastDay={nextLastDay}
                reactivate={expired}
                admin={isAdmin === true}
              />
            </>
          )}

          {!expired && (
            <div className="panel">
              <h2 className="section-title">Dados do convite</h2>
              <p className="mt-1 mb-6 text-muted">
                {published
                  ? "Ao salvar, o convite publicado é atualizado na hora."
                  : "Estes textos aparecem no convite exatamente como estão aqui."}
              </p>
              <DetailsForm
                save={saveDetails.bind(null, invitation.id)}
                invitation={invitation}
                submitLabel="Salvar dados"
              />
            </div>
          )}

          <div className="flex justify-end">
            <DeleteInvitationButton action={deleteInvitation.bind(null, invitation.id)} name={invitation.child_name} />
          </div>
        </div>
      </section>
    </main>
  );
}
