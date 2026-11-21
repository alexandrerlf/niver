// Arquivo de "Baixar meus dados" (portabilidade, art. 18 da LGPD): a conta, os convites e as presenças de cada um.
type ExportedRsvp = { invitation_id: string; [field: string]: unknown };
type ExportedInvitation = { id: string; html_template?: unknown; [field: string]: unknown };

export function buildDataExport({
  account,
  invitations,
  rsvps,
  exportedAt,
}: {
  account: { email: string; created_at: string };
  invitations: ExportedInvitation[];
  rsvps: ExportedRsvp[];
  exportedAt: Date;
}) {
  return {
    exportado_em: exportedAt.toISOString(),
    conta: { email: account.email, criada_em: account.created_at },
    convites: invitations.map(({ html_template: _html, ...invitation }) => ({
      ...invitation,
      presencas: rsvps
        .filter((rsvp) => rsvp.invitation_id === invitation.id)
        .map(({ invitation_id: _id, ...rsvp }) => rsvp),
    })),
  };
}
