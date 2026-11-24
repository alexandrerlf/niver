// Preço e validade do convite publicado. A regra da validade espelha `private.expiry_for` no banco.
export const PRICE_CENTS = 500;

// Brasil não tem horário de verão desde 2019: Brasília fica sempre em UTC-3.
const BRASILIA_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100).replace(/ /g, " ");
}

function brasiliaDay(date: Date) {
  return new Date(date.getTime() - BRASILIA_OFFSET_MS).toISOString().slice(0, 10);
}

// Último dia (AAAA-MM-DD) em que o convite fica no ar: 7 dias depois da festa, ou do pagamento se for depois.
export function lastActiveDay(eventDate: string | null, paidAt: Date) {
  const paidDay = brasiliaDay(paidAt);
  const base = eventDate && eventDate > paidDay ? eventDate : paidDay;
  return new Date(Date.parse(`${base}T00:00:00Z`) + 7 * DAY_MS).toISOString().slice(0, 10);
}

// Último dia no ar a partir do `expires_at` do banco, que é a meia-noite de Brasília do dia seguinte.
export function lastDayOf(expiresAt: string) {
  return brasiliaDay(new Date(Date.parse(expiresAt) - 1));
}
