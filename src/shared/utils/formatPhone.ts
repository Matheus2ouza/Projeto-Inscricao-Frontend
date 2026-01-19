/**
 * Formata um número de telefone para o padrão brasileiro (XX) XXXXX-XXXX.
 *
 * @param value - Número de telefone a ser formatado
 * @returns String formatada no padrão "(XX) XXXXX-XXXX"
 */
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) {
    return "";
  }

  if (numbers.length <= 2) {
    return `(${numbers}`;
  }

  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7
    )}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
    7,
    11
  )}`;
}
