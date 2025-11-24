export function getConvertStatusEvent(status: string): string {
  switch (status.toLowerCase()) {
    case "open":
      return "ABERTO";
    case "close":
      return "FECHADO";
    case "finalized":
      return "FINALIZADO";
    default:
      return status
  }
}

export function getConvertStatusInscription(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "PENDENTE";
    case "under_review":
      return "EM ANÁLISE";
    case "paid":
      return "APROVADA";
    case "cancelled":
      return "CANCELADA";
    default:
      return status
  }
}

export function getConvertStatusPayment(status: string): string {
  switch (status.toLowerCase()) {
    case "approved":
      return "PAGO";
    case "refused":
      return "RECUSADO";
    case "under_review":
      return "EM ANÁLISE";
    default:
      return status
  }
}
