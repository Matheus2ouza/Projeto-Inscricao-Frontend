import apiClient from "@/shared/lib/apiClient";

export type DashboardAdminResponse = {
  totalExpense: number;
  totalCollected: number;
  totalDebt: number;
  activeParticipants: number;
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickNumber = (data: unknown, keys: string[]): number => {
  if (typeof data === "number") return data;
  if (data && typeof data === "object") {
    for (const key of keys) {
      const val = (data as Record<string, unknown>)[key];
      if (typeof val === "number") return val;
    }
  }
  return 0;
};

const normalizeSummary = (data: unknown): DashboardAdminResponse => {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    return {
      totalExpense: toNumber(
        obj.totalExpense ??
          obj.total_expense ??
          obj.totalExpenses ??
          obj.expense ??
          obj.expenses ??
          0,
      ),
      totalCollected: toNumber(
        obj.totalCollected ?? obj.collected ?? obj.total_collected ?? 0,
      ),
      totalDebt: toNumber(obj.totalDebt ?? obj.debt ?? obj.total_debt ?? 0),
      activeParticipants: toNumber(
        obj.activeParticipants ??
          obj.participants ??
          obj.active_participants ??
          0,
      ),
    };
  }
  return {
    totalExpense: 0,
    totalCollected: 0,
    totalDebt: 0,
    activeParticipants: 0,
  };
};

export async function getDashboardAdmin(
  eventId?: string,
): Promise<DashboardAdminResponse> {
  const { data } = await apiClient.get("/dashboard/admin", {
    params: eventId ? { eventId } : undefined,
  });
  return normalizeSummary(data);
}

export async function getDashboardActiveEvents(): Promise<number> {
  const { data } = await apiClient.get("/dashboard/admin/active-events");
  return pickNumber(data, ["activeEvents", "total", "count", "value"]);
}

export async function getDashboardTotalExpense(
  eventId?: string,
): Promise<number> {
  try {
    const { data } = await apiClient.get("/dashboard/admin/expenses", {
      params: eventId ? { eventId } : undefined,
    });
    return pickNumber(data, [
      "totalExpense",
      "expense",
      "total",
      "value",
      "amount",
    ]);
  } catch {
    const summary = await getDashboardAdmin(eventId);
    return summary.totalExpense;
  }
}

export async function getDashboardTotalCollected(
  eventId?: string,
): Promise<number> {
  const { data } = await apiClient.get("/dashboard/admin/collected", {
    params: eventId ? { eventId } : undefined,
  });
  return pickNumber(data, ["totalCollected", "collected", "total", "value"]);
}

export async function getDashboardTotalDebt(eventId?: string): Promise<number> {
  const { data } = await apiClient.get("/dashboard/admin/debt", {
    params: eventId ? { eventId } : undefined,
  });
  return pickNumber(data, ["totalDebt", "debt", "total", "value"]);
}

export async function getDashboardActiveParticipants(
  eventId?: string,
): Promise<number> {
  const { data } = await apiClient.get("/dashboard/admin/active-participants", {
    params: eventId ? { eventId } : undefined,
  });
  return pickNumber(data, [
    "activeParticipants",
    "participants",
    "total",
    "value",
  ]);
}
