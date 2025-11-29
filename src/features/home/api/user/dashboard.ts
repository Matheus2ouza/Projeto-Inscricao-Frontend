import apiClient from "@/shared/lib/apiClient";

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

const toNumber = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickNumber = (data: unknown, keys: string[]): number => {
  if (typeof data === "number") return toNumber(data);
  if (data && typeof data === "object") {
    for (const key of keys) {
      const val = (data as Record<string, unknown>)[key];
      const parsed = toNumber(val);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
};

const normalizeActiveEvents = (
  data: unknown
): FindActiveEventsUserResponse => ({
  activeEvents: pickNumber(data, [
    "activeEvents",
    "events",
    "total",
    "count",
    "value",
  ]),
});

const normalizeTotalInscriptions = (
  data: unknown
): FindTotalInscriptionsUserResponse => {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    return {
      countTotalInscriptions: toNumber(
        obj.countTotalInscriptions ??
          obj.totalInscriptions ??
          obj.inscriptions ??
          obj.total
      ),
      countTotalParticipants: toNumber(
        obj.countTotalParticipants ?? obj.totalParticipants ?? obj.participants
      ),
      countPendingInscriptions: toNumber(
        obj.countPendingInscriptions ?? obj.pendingInscriptions ?? obj.pending
      ),
    };
  }

  return {
    countTotalInscriptions: 0,
    countTotalParticipants: 0,
    countPendingInscriptions: 0,
  };
};

const normalizeTotalDebt = (data: unknown): FindTotalDebtUserResponse => {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    return {
      countTotalDebt: toNumber(obj.countTotalDebt ?? obj.totalDebt ?? obj.total),
      countTotalPaid: toNumber(obj.countTotalPaid ?? obj.totalPaid ?? obj.paid),
      debtCompletionPercentage: toNumber(
        obj.debtCompletionPercentage ?? obj.percentage ?? obj.progress
      ),
    };
  }

  return {
    countTotalDebt: 0,
    countTotalPaid: 0,
    debtCompletionPercentage: 0,
  };
};

const normalizeDashboard = (data: unknown): GetDashboardUserResponse => {
  const emptySummary: GetDashboardUserResponse = {
    inscriptions: normalizeTotalInscriptions(undefined),
    events: normalizeActiveEvents(undefined),
    payments: normalizeTotalDebt(undefined),
  };

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    return {
      inscriptions: normalizeTotalInscriptions(obj.inscriptions ?? obj),
      events: normalizeActiveEvents(obj.events ?? obj),
      payments: normalizeTotalDebt(obj.payments ?? obj),
    };
  }

  return emptySummary;
};

export async function getDashboardUser(): Promise<GetDashboardUserResponse> {
  const { data } = await apiClient.get("/dashboard/user");
  return normalizeDashboard(data);
}

export async function getDashboardUserActiveEvents(): Promise<FindActiveEventsUserResponse> {
  const { data } = await apiClient.get("/dashboard/user/active-events");
  return normalizeActiveEvents(data);
}

export async function getDashboardUserTotalInscriptions(): Promise<FindTotalInscriptionsUserResponse> {
  const { data } = await apiClient.get("/dashboard/user/total-inscriptions");
  return normalizeTotalInscriptions(data);
}

export async function getDashboardUserTotalDebt(): Promise<FindTotalDebtUserResponse> {
  const { data } = await apiClient.get("/dashboard/user/total-debt");
  return normalizeTotalDebt(data);
}
