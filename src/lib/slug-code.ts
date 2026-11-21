import { randomBytes } from "node:crypto";

// Código aleatório do link do convite: 8 bytes, 16 caracteres hexadecimais (64 bits), para o link não ser adivinhado.
export function slugCode() {
  return randomBytes(8).toString("hex");
}
