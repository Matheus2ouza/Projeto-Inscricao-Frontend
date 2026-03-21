export type FormatType = "phone" | "date" | "cpf";

/**
 * Função de formatação auxiliar, recebe um valor de input de acordo com o tipo especificado.
 * @param type - Tipo de formatação: `"phone"` | `"date"` | `"cpf"`
 * @param value - Valor bruto do input
 * @returns Valor formatado como string
 * @example
 * formatInput("phone", "11987654321") // "(11) 98765-4321"
 * formatInput("date",  "01011990")    // "01/01/1990"
 * formatInput("cpf",   "12345678901") // "123.456.789-01"
 */
export function formatInput(type: FormatType, value: string): string {
  const formatters: Record<FormatType, (value: string) => string> = {
    phone: (value) => {
      const n = value.replace(/\D/g, "");
      if (n.length <= 2) return n ? `(${n}` : "";
      if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
      if (n.length <= 10)
        return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
      return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`;
    },
    date: (value) => {
      const n = value.replace(/\D/g, "");
      if (n.length <= 2) return n;
      if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
      return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4, 8)}`;
    },
    cpf: (value) => {
      const n = value.replace(/\D/g, "").slice(0, 11);
      if (n.length <= 3) return n;
      if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
      if (n.length <= 9)
        return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
      return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
    },
  };

  return formatters[type](value);
}
