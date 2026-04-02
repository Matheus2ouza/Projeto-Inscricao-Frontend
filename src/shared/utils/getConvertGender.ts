export type GenderType = "MASCULINO" | "FEMININO";

/**
 * Retorna o label em pt-BR e a cor do badge para um gênero.
 * @param gender - Tipo de gênero: `"MASCULINO"` | `"FEMININO"`
 * @returns Objeto com `label` traduzido e `color` para o badge
 * @example
 * getGenderInfo("MASCULINO") // { label: "Masculino", color: "blue" }
 * getGenderInfo("FEMININO")  // { label: "Feminino", color: "pink" }
 * getGenderInfo(undefined)   // { label: "—", color: "default" }
 */
export function getGenderInfo(gender?: GenderType): {
  label: string;
  color: string;
} {
  switch (gender) {
    case "MASCULINO":
      return { label: "Masculino", color: "blue" };
    case "FEMININO":
      return { label: "Feminino", color: "pink" };
    default:
      return { label: "—", color: "default" };
  }
}
