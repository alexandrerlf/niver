// Dados da Política de Privacidade e dos Termos de Uso. Trocar o e-mail de contato é mudar uma linha aqui.
export const LEGAL = {
  controller: "Alexandre Rodrigues Lopes Filho",
  privacyEmail: "alexandrerodrigueslopesfilho@gmail.com",
  forum: "Manaus/AM",
  rsvpRetentionMonths: 6,
  // Data em que a versão atual dos textos passou a valer (AAAA-MM-DD).
  effectiveDate: "2026-11-21",
} as const;

export function formatEffectiveDate(date: string = LEGAL.effectiveDate) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}
