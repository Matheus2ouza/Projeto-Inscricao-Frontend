export function getPaymentStatusInfo(
  status: boolean | string | number | null | undefined,
): {
  label: string;
  badgeClass: string;
  disabled: boolean;
} {
  if (status === true || status === "true" || status === 1) {
    return {
      label: "Pagamentos Liberados",
      badgeClass: "bg-green-500 text-white",
      disabled: false,
    };
  }

  if (status === false || status === "false" || status === 0) {
    return {
      label: "Pagamentos Bloqueados",
      badgeClass: "bg-red-500 text-white",
      disabled: true,
    };
  }

  return {
    label: "Status Desconhecido",
    badgeClass: "bg-gray-500 text-white",
    disabled: true,
  };
}
