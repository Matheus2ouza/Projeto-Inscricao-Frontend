type AvailabilityState = {
  badgeClass: string;
  label: string;
  isSoldOut: boolean;
};

const availabilityBadge = {
  safe: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  soldOut:
    "bg-muted text-muted-foreground dark:bg-zinc-800/80 dark:text-zinc-300",
};

export function getAvailabilityState(
  available: number,
  total: number
): AvailabilityState {
  if (available <= 0 || total <= 0) {
    return {
      badgeClass: availabilityBadge.soldOut,
      label: "Esgotado",
      isSoldOut: true,
    };
  }

  const ratio = available / total;
  if (ratio <= 1 / 3) {
    return {
      badgeClass: availabilityBadge.danger,
      label: `${available} disp.`,
      isSoldOut: false,
    };
  }

  if (ratio <= 1 / 2) {
    return {
      badgeClass: availabilityBadge.warning,
      label: `${available} disp.`,
      isSoldOut: false,
    };
  }

  return {
    badgeClass: availabilityBadge.safe,
    label: `${available} disp.`,
    isSoldOut: false,
  };
}
