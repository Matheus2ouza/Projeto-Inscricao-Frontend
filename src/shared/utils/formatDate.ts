/**
 * Formata uma data e hora no formato brasileiro.
 * @param dateString - A data e hora a ser formatada. Pode ser uma string ou um objeto Date.
 * @returns A data e hora formatada no formato "DD/MM/YYYY - HH:MM". Se a entrada for inválida, retorna "-".
 */
export function formatDateTime(dateString: string | Date) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Formata data: DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  // Formata hora: HH:MM
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

/**
 * Formata uma data no formato brasileiro.
 * @param dateString - A data a ser formatada. Pode ser uma string ou um objeto Date.
 * @returns A data formatada no formato "DD/MM/YYYY". Se a entrada for inválida, retorna "-".
 */
export function formatDate(dateString: string | Date) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Formata data: DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
