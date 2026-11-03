import Link from "next/link";
import { deleteInvitation } from "@/app/actions";
import { DeleteInvitationButton } from "@/components/delete-invitation-button";
import { ART_BUCKET, type Invitation } from "@/lib/invitation";
import { formatDate } from "@/lib/render";
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

  return (
    <main>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Seus convites</h1>
        <Link href="/novo" className="button-primary shrink-0">
          Novo convite
        </Link>
      </div>

      {invitations.length === 0 ? (
        <div className="panel text-center">
          <p className="font-display text-xl font-bold">Nenhum convite ainda</p>
          <p className="mt-1 text-muted">Escolha um modelo e preencha os dados da festa.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="flex flex-col">
              <Link
                href={`/convites/${invitation.id}`}
                className="block overflow-hidden rounded-2xl border border-line bg-card"
              >
                {invitation.image_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      supabase.storage.from(ART_BUCKET).getPublicUrl(invitation.image_path).data
                        .publicUrl
                    }
                    alt=""
                    className="aspect-[9/14] w-full object-cover object-top"
                  />
                ) : (
                  <div className="aspect-[9/14] bg-sun/40" />
                )}
                <div className="p-3">
                  <p className="truncate font-bold">{invitation.child_name || "Sem nome"}</p>
                  <p className="truncate text-sm text-muted">
                    {invitation.status === "published"
                      ? formatDate(invitation.event_date)
                      : "Rascunho"}
                  </p>
                </div>
              </Link>
              <DeleteInvitationButton
                action={deleteInvitation.bind(null, invitation.id)}
                name={invitation.child_name}
                className="mt-1 min-h-11 self-start px-1 text-sm font-bold text-danger"
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
