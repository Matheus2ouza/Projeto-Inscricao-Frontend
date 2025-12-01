/**
 * Retorna a classe CSS do tamanho da fonte baseado na quantidade de caracteres do texto.
 *
 * @param text - Texto para calcular o tamanho da fonte
 * @param isCardTitle - Se true, usa limites maiores (para títulos de card). Se false, usa limites menores (para textos dentro de imagens)
 * @returns String com a classe CSS do tamanho da fonte Tailwind
 */
export function getFontSizeClass(text: string, isCardTitle = false): string {
  const length = text.length;

  if (isCardTitle) {
    // Para o título do card (h3)
    if (length <= 20) {
      return "text-lg"; // 18px - tamanho padrão
    } else if (length <= 30) {
      return "text-base"; // 16px
    } else if (length <= 35) {
      return "text-sm"; // 14px
    } else {
      return "text-xs"; // 12px
    }
  } else {
    // Para o texto dentro do gradiente da imagem
    if (length <= 15) {
      return "text-lg"; // 18px
    } else if (length <= 25) {
      return "text-base"; // 16px
    } else if (length <= 35) {
      return "text-sm"; // 14px
    } else {
      return "text-xs"; // 12px
    }
  }
}

