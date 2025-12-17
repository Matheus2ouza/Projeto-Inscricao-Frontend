/**
 * Retorna a classe CSS do tamanho da fonte baseado na quantidade de caracteres do texto.
 *
 * @param text - Texto para calcular o tamanho da fonte
 * @param isCardTitle - Se true, usa limites maiores (para títulos de card). Se false, usa limites menores (para textos dentro de imagens)
 * @returns String com a classe CSS do tamanho da fonte Tailwind
 */
"use client";

/** Normaliza o texto para calcular o tamanho, removendo espaços extras. */
const normalizeText = (input: string) => input.trim();

export function getFontSizeClass(text: string, isCardTitle = false): string {
  const normalized = normalizeText(text);
  const length = normalized.length;

  if (isCardTitle) {
    return "text-8xl"
  }

  if (length <= 12) {
    return "text-lg";
  }
  if (length <= 24) {
    return "text-base";
  }
  if (length <= 36) {
    return "text-sm";
  }
  return "text-xs";
}

