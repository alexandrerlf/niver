// Quando oferecer a instalação do app. Fica numa função pura para os testes cobrirem cada regra.
export const DISMISS_DAYS = 14;
const DAY = 24 * 60 * 60 * 1000;

export type InstallPromptState = {
  tutorialDone: boolean;
  // Aberto pelo ícone do app instalado.
  standalone: boolean;
  // Instalado a partir deste aparelho.
  installed: boolean;
  // Quando a pessoa fechou o aviso, em milissegundos.
  dismissedAt: number | null;
  // O navegador disparou `beforeinstallprompt`.
  canPrompt: boolean;
  ios: boolean;
  now: number;
};

export function installPromptKind(state: InstallPromptState): "prompt" | "ios" | null {
  if (!state.tutorialDone || state.standalone || state.installed) return null;
  if (state.dismissedAt !== null && state.now - state.dismissedAt < DISMISS_DAYS * DAY) return null;
  if (state.canPrompt) return "prompt";
  if (state.ios) return "ios";
  return null;
}

// O iPad recente se apresenta como Mac; a tela de toque denuncia.
export function isIos(userAgent: string, maxTouchPoints: number) {
  return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
}
