/**
 * Retorna as iniciais de um nome, pegando a primeira letra de cada palavra
 * e ignorando conectivos (de, da, do, e, para, etc.).
 *
 * Exemplos:
 * - "CONFERÊNCIA TROPAS E CAPITÃES" -> "CTC"
 * - "CONFERÊNCIA EM CASTANHAL" -> "CC" (ignora "em" se você quiser incluir)
 * - "Aperfeiçoamento para Serviços" -> "AS"
 *
 * @param name - Nome completo ou parcial
 * @returns Iniciais em maiúsculas
 */
export function getInitial(name: string): string {
  if (!name) return "";

  const STOP = new Set([
    "de",
    "da",
    "das",
    "des",
    "dos",
    "do",
    "e",
    "a",
    "o",
    "pra",
    "para",
    "em",
  ]);

  // Pega somente palavras compostas por letras Unicode (com acentos)
  const words = name.toLowerCase().match(/\p{L}+/gu) ?? [];

  return words
    .filter((w) => !STOP.has(w))
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
