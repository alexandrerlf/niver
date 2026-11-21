import { describe, expect, it } from "vitest";
import { DISMISS_DAYS, installPromptKind, isIos } from "@/lib/install-prompt";

const now = new Date("2026-11-21T12:00:00Z").getTime();
const day = 24 * 60 * 60 * 1000;
const base = {
  tutorialDone: true,
  standalone: false,
  installed: false,
  dismissedAt: null,
  canPrompt: true,
  ios: false,
  now,
};

describe("installPromptKind", () => {
  it("oferece o botão quando o navegador permite instalar", () => {
    expect(installPromptKind(base)).toBe("prompt");
  });

  it("mostra o passo a passo no iPhone, onde não há botão do navegador", () => {
    expect(installPromptKind({ ...base, canPrompt: false, ios: true })).toBe("ios");
  });

  it("não aparece em navegador que não instala nem é iPhone", () => {
    expect(installPromptKind({ ...base, canPrompt: false })).toBeNull();
  });

  it("não aparece enquanto o tutorial não foi visto", () => {
    expect(installPromptKind({ ...base, tutorialDone: false })).toBeNull();
  });

  it("não aparece aberto como app", () => {
    expect(installPromptKind({ ...base, standalone: true })).toBeNull();
    expect(installPromptKind({ ...base, standalone: true, canPrompt: false, ios: true })).toBeNull();
  });

  it("não volta depois de instalado no aparelho", () => {
    expect(installPromptKind({ ...base, installed: true })).toBeNull();
  });

  it(`fica escondido por ${DISMISS_DAYS} dias depois de fechado`, () => {
    expect(installPromptKind({ ...base, dismissedAt: now - 13 * day })).toBeNull();
    expect(installPromptKind({ ...base, dismissedAt: now - 14 * day })).toBe("prompt");
  });
});

describe("isIos", () => {
  it("reconhece iPhone e iPad", () => {
    expect(isIos("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/604.1", 5)).toBe(true);
    // O iPad se apresenta como Mac, mas tem tela de toque.
    expect(isIos("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15", 5)).toBe(true);
  });

  it("não confunde Mac e Android", () => {
    expect(isIos("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15", 0)).toBe(false);
    expect(isIos("Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/131.0 Mobile", 5)).toBe(false);
  });
});
