export function getTicketStatusInfo(ticketEnabled: boolean) {
  if (ticketEnabled) {
    return {
      label: "Venda Liberada",
      badgeClass: "bg-emerald-500 hover:bg-emerald-600 text-white",
      disabled: false,
      description: "Os tickets deste evento estão disponíveis para compra.",
    };
  }

  return {
    label: "Venda indisponível",
    badgeClass: "bg-amber-500 hover:bg-amber-600 text-white",
    disabled: true,
    description:
      "Ainda estamos preparando a venda de tickets para este evento.",
  };
}
