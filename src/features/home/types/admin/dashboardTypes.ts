export type DashboardAdminResponse = {
  totalExpense: number;
  totalCollected: number;
  totalNetValueCollected: number;
  totalDebt: number;
  activeParticipants: number;
};

export type DashboardCollectedTotals = {
  totalCollected: number;
  totalNetValueCollected: number;
};

export type DashboardMetric = keyof DashboardAdminResponse;
