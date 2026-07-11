export type FormatType = 'phone' | 'date' | 'dateShort' | 'cpf';

export type DateFormatOptions = {
  day?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  year?: 'numeric' | '2-digit';
};

/**
 * Função de formatação auxiliar, recebe um valor de input de acordo com o tipo especificado.
 * @param type - Tipo de formatação: `"phone"` | `"date"` | `"dateShort"` | `"cpf"`
 * @param value - Valor bruto do input (data no formato ISO ou timestamp)
 * @param dateOptions - Opções adicionais para formatação da data
 * @returns Valor formatado como string
 * @example
 * formatInput("phone", "11987654321") // "(11) 98765-4321"
 * formatInput("date", "2024-01-15")   // "15 de janeiro de 2024"
 * formatInput("dateShort", "2024-01-15") // "15/01/2024"
 * formatInput("cpf", "12345678901")   // "123.456.789-01"
 */
export function formatInput(
  value: string,
  type: FormatType | string, // ✅ Aceita tanto FormatType quanto string
  dateOptions?: DateFormatOptions,
): string {
  // Validar se o tipo é válido
  if (!isValidFormatType(type)) {
    console.warn(
      `Tipo de formatação inválido: "${type}". Retornando valor original.`,
    );
    return value;
  }

  const formatters: Record<FormatType, (value: string) => string> = {
    phone: (value) => {
      const n = value.replace(/\D/g, '');
      if (n.length <= 2) return n ? `(${n}` : '';
      if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
      if (n.length <= 10)
        return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
      return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`;
    },
    date: (value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;

      return date.toLocaleDateString('pt-BR', {
        day: dateOptions?.day ?? '2-digit',
        month: dateOptions?.month ?? 'long',
        year: dateOptions?.year ?? 'numeric',
      });
    },
    dateShort: (value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;

      return date.toLocaleDateString('pt-BR', {
        day: dateOptions?.day ?? '2-digit',
        month: dateOptions?.month ?? '2-digit',
        year: dateOptions?.year ?? 'numeric',
      });
    },
    cpf: (value) => {
      const n = value.replace(/\D/g, '').slice(0, 11);
      if (n.length <= 3) return n;
      if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
      if (n.length <= 9)
        return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
      return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
    },
  };

  // Usar type assertion para garantir que o tipo é válido
  return formatters[type as FormatType](value);
}

// Função auxiliar para validar se o tipo é um FormatType válido
function isValidFormatType(type: string): type is FormatType {
  return ['phone', 'date', 'dateShort', 'cpf'].includes(type);
}
