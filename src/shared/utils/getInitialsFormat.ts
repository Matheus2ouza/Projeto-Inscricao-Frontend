/**
 * Retorna as iniciais de um nome e a classe de tamanho da fonte
 * baseada na quantidade de letras.
 *
 * Exemplos:
 * - "CONFERÊNCIA TROPAS E CAPITÃES"
 *   => { initials: "CTC", fontSize: "text-base sm:text-lg" }
 *
 * - "Aperfeiçoamento para Serviços"
 *   => { initials: "AS", fontSize: "text-lg sm:text-xl" }
 */
export function getInitialFormat(name: string) {
  if (!name) {
    return {
      initials: '',
      fontSize: 'text-lg sm:text-xl',
    };
  }

  const STOP = new Set([
    'de',
    'da',
    'das',
    'des',
    'dos',
    'do',
    'e',
    'a',
    'o',
    'pra',
    'para',
    'em',
  ]);

  // Pega somente palavras compostas por letras Unicode (com acentos)
  const words = name.toLowerCase().match(/\p{L}+/gu) ?? [];

  const initials = words
    .filter((w) => !STOP.has(w))
    .map((w) => w[0])
    .join('')
    .slice(0, 6)
    .toUpperCase();

  const length = initials.length;

  let fontSize = 'text-xs sm:text-sm';

  if (length <= 2) {
    fontSize = 'text-lg sm:text-xl';
  } else if (length <= 4) {
    fontSize = 'text-base sm:text-lg';
  } else if (length <= 6) {
    fontSize = 'text-sm sm:text-sm';
  }

  return {
    initials,
    fontSize,
  };
}
