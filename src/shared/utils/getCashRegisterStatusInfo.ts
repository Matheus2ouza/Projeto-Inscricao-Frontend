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
  if (status === CashRegisterStatus.OPEN) {
    return {
      label: "Aberto",
      badgeClass:
        "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    };
  }

  return {
    label: "Fechado",
    badgeClass:
      "bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200",
  };
}
