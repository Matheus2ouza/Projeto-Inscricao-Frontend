export function getEventStatusInfo(status: string): {
  label: string;
  badgeClass: string;
  disabled: boolean;
} {
  switch (status) {
    case "OPEN":
      return {
        label: "Inscrições Abertas",
        badgeClass: "bg-green-500 text-white",
        disabled: false,
      };
    case "CLOSE":
      return {
        label: "Inscrições Fechadas",
        badgeClass: "bg-red-500 text-white",
        disabled: true,
      };
    case "FINALIZED":
      return {
        label: "Evento Finalizado",
        badgeClass: "bg-gray-500 text-white",
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
