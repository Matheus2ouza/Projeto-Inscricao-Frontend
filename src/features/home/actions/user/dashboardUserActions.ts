'use server';

import {
  dashboardUserActiveEventsService,
  dashboardUserService,
  dashboardUserTotalDebtService,
  dashboardUserTotalInscriptionsService,
} from '@/features/home/services/user/dashboardUserService';
import type {
  FindActiveEventsUserResponse,
  FindTotalDebtUserResponse,
  FindTotalInscriptionsUserResponse,
  GetDashboardUserResponse,
} from '@/features/home/types/user/dashboardUserTypes';

const toNumber = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickNumber = (data: unknown, keys: string[]): number => {
  if (typeof data === 'number') return toNumber(data);
  if (data && typeof data === 'object') {
    for (const key of keys) {
      const val = (data as Record<string, unknown>)[key];
      const parsed = toNumber(val);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
};

const normalizeActiveEvents = (
  data: unknown,
): FindActiveEventsUserResponse => ({
  activeEvents: pickNumber(data, [
    'activeEvents',
    'events',
    'total',
    'count',
    'value',
  ]),
});

const normalizeTotalInscriptions = (
  data: unknown,
): FindTotalInscriptionsUserResponse => {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    return {
      countTotalInscriptions: toNumber(
        obj.countTotalInscriptions ??
          obj.totalInscriptions ??
          obj.inscriptions ??
          obj.total,
      ),
      countTotalParticipants: toNumber(
        obj.countTotalParticipants ?? obj.totalParticipants ?? obj.participants,
      ),
      countPendingInscriptions: toNumber(
        obj.countPendingInscriptions ?? obj.pendingInscriptions ?? obj.pending,
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
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    return {
      countTotalDebt: toNumber(
        obj.countTotalDebt ?? obj.totalDebt ?? obj.total,
      ),
      countTotalPaid: toNumber(obj.countTotalPaid ?? obj.totalPaid ?? obj.paid),
      debtCompletionPercentage: toNumber(
        obj.debtCompletionPercentage ?? obj.percentage ?? obj.progress,
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

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    return {
      inscriptions: normalizeTotalInscriptions(obj.inscriptions ?? obj),
      events: normalizeActiveEvents(obj.events ?? obj),
      payments: normalizeTotalDebt(obj.payments ?? obj),
    };
  }

  return emptySummary;
};

/**
 * Action: Busca o dashboard completo do usuário
 * Normaliza os dados recebidos do service
 */
export async function getDashboardUserAction(): Promise<GetDashboardUserResponse> {
  const data = await dashboardUserService();
  return normalizeDashboard(data);
}

/**
 * Action: Busca eventos ativos do usuário
 * Normaliza os dados recebidos do service
 */
export async function getDashboardUserActiveEventsAction(): Promise<FindActiveEventsUserResponse> {
  const data = await dashboardUserActiveEventsService();
  return normalizeActiveEvents(data);
}

/**
 * Action: Busca total de inscrições do usuário
 * Normaliza os dados recebidos do service
 */
export async function getDashboardUserTotalInscriptionsAction(): Promise<FindTotalInscriptionsUserResponse> {
  const data = await dashboardUserTotalInscriptionsService();
  return normalizeTotalInscriptions(data);
}

/**
 * Action: Busca total de dívidas do usuário
 * Normaliza os dados recebidos do service
 */
export async function getDashboardUserTotalDebtAction(): Promise<FindTotalDebtUserResponse> {
  const data = await dashboardUserTotalDebtService();
  return normalizeTotalDebt(data);
}
