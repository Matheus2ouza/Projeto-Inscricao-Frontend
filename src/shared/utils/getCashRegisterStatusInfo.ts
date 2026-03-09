export enum CashRegisterStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

/**
 * Retorna informações visuais e textuais para um status de caixa registradora.
 * Fornece o label traduzido e as classes CSS para estilização de badge/badge.
 *
 * @param status - O status do caixa (OPEN ou CLOSED)
 * @returns Objeto contendo label traduzido e classes CSS para estilização do badge
 * @returns.label Texto traduzido do status ("Aberto" ou "Fechado")
 * @returns.badgeClass Classes Tailwind CSS para estilização do badge de acordo com o tema claro/escuro
 */
export function getListCashRegistersStatusInfo(status: CashRegisterStatus) {
  switch (status) {
    case CashRegisterStatus.OPEN:
      return {
        label: "Caixa Aberto",
        badgeClass: "bg-green-500 text-white",
        disabled: false,
      };
    case CashRegisterStatus.CLOSED:
      return {
        label: "Caixa Fechado",
        badgeClass: "bg-red-500 text-white",
        disabled: true,
      };
    default:
      return {
        label: "Status Desconhecido",
        badgeClass: "bg-gray-500 text-white",
        disabled: true,
      };
  }
}
