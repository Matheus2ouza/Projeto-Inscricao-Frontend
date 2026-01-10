export function getStatusInscriptionText(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "PENDENTE";
    case "paid":
      return "APROVADA";
    case "cancelled":
      return "REJEITADA";
    case "under_review":
      return "EM ANÁLISE";
    default:
      return status.toUpperCase();
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "approved":
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "under_review":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "refused":
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

export function getStatusEventColor(status?: string): string {
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case "open":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "close":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "finalized":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}
