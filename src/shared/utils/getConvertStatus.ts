export function getConvertStatus(status: string): string {
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
