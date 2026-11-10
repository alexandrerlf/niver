import Link from "next/link";
import { deleteInvitation } from "@/app/actions";
import { ArtCard, EmptyState } from "@/components/art-card";
import { DeleteInvitationButton } from "@/components/delete-invitation-button";
import { Icon } from "@/components/icons";
import { formatDayMonth } from "@/lib/countdown";
import { ART_BUCKET, type Invitation } from "@/lib/invitation";
import { createClient, getUserId } from "@/lib/supabase/server";

type Row = Pick<Invitation, "id" | "child_name" | "event_date" | "status" | "image_path">;

export default async function DashboardPage() {
  const supabase = await createClient();
  const userId = await getUserId(supabase);
  const { data } = await supabase
    .from("invitations")
    .select("id, child_name, event_date, status, image_path")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  const invitations = (data ?? []) as Row[];
  const published = invitations.filter((invitation) => invitation.status === "published").length;

  return (
    <main>
      <div className="mb-8 flex animate-rise flex-wrap items-end justify-between gap-x-6 gap-y-5 sm:mb-10">
        <div>
          <p className="eyebrow">Suas festas</p>
          <h1 className="page-title mt-2">Seus convites</h1>
          {invitations.length > 0 && (
            <p className="mt-3 text-muted">
              {invitations.length} {invitations.length === 1 ? "convite" : "convites"}
              {published > 0 && ` · ${published} no ar`}
            </p>
          )}
        </div>
        {invitations.length > 0 && (
          <Link href="/novo" className="button-primary">
            <Icon name="plus" className="size-[18px]" />
            Novo convite
          </Link>
        )}
      </div>

      {invitations.length === 0 ? (
        <EmptyState
          icon={<Icon name="sparkles" className="size-8" />}
          title="Sua primeira festa começa aqui"
          action={
            <Link href="/novo" className="button-primary">
              <Icon name="plus" className="size-[18px]" />
              Criar convite
            </Link>
          }
        >
          Escolha um modelo, preencha os dados da festa e compartilhe o link com os convidados.
        </EmptyState>
      ) : (
        <ul className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {invitations.map((invitation) => (
            <li key={invitation.id}>
              <ArtCard
                href={`/convites/${invitation.id}`}
                imageUrl={
                  invitation.image_path
                    ? supabase.storage.from(ART_BUCKET).getPublicUrl(invitation.image_path).data.publicUrl
                    : null
                }
                title={invitation.child_name || "Sem nome"}
                subtitle={formatDayMonth(invitation.event_date) || "Sem data"}
                badge={
                  invitation.status === "published"
                    ? { label: "No ar", tone: "leaf" }
                    : { label: "Rascunho", tone: "sun" }
                }
              >
                <DeleteInvitationButton
                  action={deleteInvitation.bind(null, invitation.id)}
                  name={invitation.child_name}
                  variant="overlay"
                />
              </ArtCard>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
