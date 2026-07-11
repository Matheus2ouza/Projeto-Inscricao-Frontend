export type FindActiveEventsUserResponse = {
  activeEvents: number;
};

export type FindTotalDebtUserResponse = {
  countTotalDebt: number;
  countTotalPaid: number;
  debtCompletionPercentage: number;
};

export type FindTotalInscriptionsUserResponse = {
  countTotalInscriptions: number;
  countTotalParticipants: number;
  countPendingInscriptions: number;
};

export type GetDashboardUserResponse = {
  inscriptions: FindTotalInscriptionsUserResponse;
  events: FindActiveEventsUserResponse;
  payments: FindTotalDebtUserResponse;
};
