/**
 * Formata um número para o padrão monetário brasileiro (BRL).
 *
 * @param value - Número a ser formatado como moeda
 * @returns String formatada no padrão "R$ 0,00"
 */
export function getFormatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
