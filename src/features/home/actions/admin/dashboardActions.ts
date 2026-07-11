import {
  dashboardActiveEventsService,
  dashboardActiveParticipantsService,
  dashboardAdminService,
  dashboardCollectedTotalsService,
  dashboardTotalDebtService,
  dashboardTotalExpenseService,
} from '@/features/home/services/admin/dashboardServices';
import type {
  DashboardAdminResponse,
  DashboardCollectedTotals,
} from '../../types/admin/dashboardTypes';

const toNumber = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickNumber = (data: unknown, keys: string[]): number => {
  if (typeof data === 'number') return data;
  if (data && typeof data === 'object') {
    for (const key of keys) {
      const val = (data as Record<string, unknown>)[key];
      if (typeof val === 'number') return val;
    }
  }
  return 0;
};

export const normalizeDashboardSummary = (
  data: unknown,
): DashboardAdminResponse => {
  if (data && typeof data === 'object') {
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
      totalNetValueCollected: toNumber(
        obj.totalNetValueCollected ??
          obj.total_net_value_collected ??
          obj.totalNetCollected ??
          obj.netCollected ??
          obj.net_collected ??
          obj.total_net_collected ??
          0,
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
    totalNetValueCollected: 0,
    totalDebt: 0,
    activeParticipants: 0,
  };
};

export const normalizeCollectedTotals = (
  data: unknown,
): DashboardCollectedTotals => {
  return {
    totalCollected: pickNumber(data, [
      'totalCollected',
      'collected',
      'total',
      'value',
    ]),
    totalNetValueCollected: pickNumber(data, [
      'totalNetValueCollected',
      'total_net_value_collected',
      'totalNetCollected',
      'netCollected',
      'net_collected',
      'totalNetValue',
      'netValue',
      'net_value',
      'total',
      'value',
    ]),
  };
};

export const normalizeMetricValue = (
  data: unknown,
  fallback: number = 0,
): number => {
  const value = pickNumber(data, [
    'value',
    'total',
    'amount',
    'count',
    'totalExpense',
    'expense',
    'totalCollected',
    'collected',
    'totalDebt',
    'debt',
    'activeParticipants',
    'participants',
  ]);
  return value !== 0 ? value : fallback;
};

export async function getDashboardAdminAction(
  eventId?: string,
): Promise<DashboardAdminResponse> {
  const data = await dashboardAdminService(eventId);
  return normalizeDashboardSummary(data); // ← Normaliza aqui!
}

export async function getDashboardTotalExpenseAction(
  eventId?: string,
): Promise<number> {
  const data = await dashboardTotalExpenseService(eventId);
  return normalizeMetricValue(data); // ← Normaliza aqui!
}

export async function getDashboardCollectedTotalsAction(
  eventId?: string,
): Promise<DashboardCollectedTotals> {
  const data = await dashboardCollectedTotalsService(eventId);
  return normalizeCollectedTotals(data); // ← Normaliza aqui!
}

export async function getDashboardTotalDebtAction(
  eventId?: string,
): Promise<number> {
  const data = await dashboardTotalDebtService(eventId);
  return normalizeMetricValue(data); // ← Normaliza aqui!
}

export async function getDashboardActiveParticipantsAction(
  eventId?: string,
): Promise<number> {
  const data = await dashboardActiveParticipantsService(eventId);
  return normalizeMetricValue(data); // ← Normaliza aqui!
}

export async function getDashboardActiveEventsAction(): Promise<number> {
  const data = await dashboardActiveEventsService();
  return normalizeMetricValue(data); // ← Normaliza aqui!
}
