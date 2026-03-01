import { CashEntryOrigin } from "@/features/cashRegister/types/cashRegisterDetails/cashRegisterDetailsType";

export function getConvertCashEntryOrigin(origin: CashEntryOrigin): string {
  switch (origin) {
    case CashEntryOrigin.ASAAS:
      return "Asaas";
    case CashEntryOrigin.INTERNAL:
      return "Interno";
    case CashEntryOrigin.ONSITE:
      return "Presencial";
    case CashEntryOrigin.EXPENSE:
      return "Despesa";
    case CashEntryOrigin.TICKET:
      return "Ingresso";
    case CashEntryOrigin.TRANSFER:
      return "Transferência";
    case CashEntryOrigin.MANUAL:
      return "Manual";
    default:
      return String(origin);
  }
}
