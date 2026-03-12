export function getConvertStatusEvent(status: string): string {
  switch (status.toLowerCase()) {
    case "open":
      return "Inscrições Abertas";
    case "close":
      return "Inscrições Fechadas";
    case "finalized":
      return "Evento Finalizado";
    default:
      return status;
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
    case "expired":
      return "EXPIRADA";
    case "cancelled":
      return "CANCELADA";
    default:
      return status;
  }
}

export function getConvertStatusPayment(status: string): string {
  switch (status.toLowerCase()) {
    case "approved":
      return "APROVADO";
    case "refused":
      return "RECUSADO";
    case "under_review":
      return "EM ANÁLISE";
    default:
      return status;
  }
}
