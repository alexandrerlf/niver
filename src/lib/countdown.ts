const DAY = 86_400_000;

// Dias até a festa, contados no fuso de Brasília para não virar o dia mais cedo no servidor.
export function daysUntil(date: string | null, now = new Date()) {
  if (!date) return null;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(now);
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY);
}

export function countdownLabel(days: number | null) {
  if (days === null) return "";
  if (days < 0) return "Já aconteceu";
  if (days === 0) return "É hoje!";
  if (days === 1) return "É amanhã";
  return `Faltam ${days} dias`;
}

export function formatDayMonth(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
