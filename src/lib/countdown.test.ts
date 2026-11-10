import { describe, expect, it } from "vitest";
import { countdownLabel, daysUntil, formatDayMonth } from "./countdown";

describe("daysUntil", () => {
  it("conta os dias no fuso de Brasília", () => {
    // 01:00 UTC do dia 11 ainda é dia 10 em Brasília.
    const now = new Date("2026-11-11T01:00:00Z");
    expect(daysUntil("2026-11-10", now)).toBe(0);
    expect(daysUntil("2026-11-11", now)).toBe(1);
    expect(daysUntil("2026-11-09", now)).toBe(-1);
    expect(daysUntil(null, now)).toBeNull();
  });
});

describe("countdownLabel", () => {
  it("descreve a distância até a festa", () => {
    expect(countdownLabel(-3)).toBe("Já aconteceu");
    expect(countdownLabel(0)).toBe("É hoje!");
    expect(countdownLabel(1)).toBe("É amanhã");
    expect(countdownLabel(12)).toBe("Faltam 12 dias");
    expect(countdownLabel(null)).toBe("");
  });
});

describe("formatDayMonth", () => {
  it("escreve o dia e o mês por extenso", () => {
    expect(formatDayMonth("2026-12-05")).toBe("5 de dezembro");
    expect(formatDayMonth(null)).toBe("");
  });
});
