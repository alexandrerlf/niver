import { describe, expect, it } from "vitest";
import { buildDataExport } from "@/lib/data-export";

describe("buildDataExport", () => {
  const file = buildDataExport({
    account: { email: "ana@exemplo.com", created_at: "2026-11-01T10:00:00Z" },
    invitations: [
      { id: "c1", child_name: "Lia", html_template: "<html>…</html>", slug: "lia-6-anos-x" },
      { id: "c2", child_name: "Theo", html_template: null, slug: "theo-x" },
    ],
    rsvps: [
      { invitation_id: "c1", guest_name: "Bia", party_size: 2, created_at: "2026-11-02T10:00:00Z" },
      { invitation_id: "c1", guest_name: "Caio", party_size: 1, created_at: "2026-11-03T10:00:00Z" },
    ],
    exportedAt: new Date("2026-11-21T12:00:00Z"),
  });

  it("traz a conta e a data da exportação", () => {
    expect(file.conta).toEqual({ email: "ana@exemplo.com", criada_em: "2026-11-01T10:00:00Z" });
    expect(file.exportado_em).toBe("2026-11-21T12:00:00.000Z");
  });

  it("agrupa as presenças em cada convite", () => {
    expect(file.convites[0].presencas.map((rsvp) => rsvp.guest_name)).toEqual(["Bia", "Caio"]);
    expect(file.convites[1].presencas).toEqual([]);
    expect(file.convites[0].presencas[0]).not.toHaveProperty("invitation_id");
  });

  it("deixa de fora o HTML do modelo", () => {
    expect(file.convites[0]).not.toHaveProperty("html_template");
    expect(file.convites[0]).toMatchObject({ id: "c1", child_name: "Lia", slug: "lia-6-anos-x" });
  });
});
