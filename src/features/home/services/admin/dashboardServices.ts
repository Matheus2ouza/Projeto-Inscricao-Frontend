'use server';

import { axiosServer } from '@/lib/axios/server';

export async function dashboardAdminService(
  eventId?: string,
): Promise<unknown> {
  const { data } = await axiosServer.get('/dashboard/admin', {
    params: eventId ? { eventId } : undefined,
  });
  return data; // ← Retorna dados brutos
}

export async function dashboardTotalExpenseService(
  eventId?: string,
): Promise<unknown> {
  try {
    const { data } = await axiosServer.get('/dashboard/admin/expenses', {
      params: eventId ? { eventId } : undefined,
    });
    return data; // ← Retorna dados brutos
  } catch {
    // Fallback: busca resumo e retorna apenas o campo necessário
    const summary = await dashboardAdminService(eventId);
    return summary;
  }
}

export async function dashboardCollectedTotalsService(
  eventId?: string,
): Promise<unknown> {
  const { data } = await axiosServer.get('/dashboard/admin/collected', {
    params: eventId ? { eventId } : undefined,
  });
  return data; // ← Retorna dados brutos
}

export async function dashboardTotalDebtService(
  eventId?: string,
): Promise<unknown> {
  const { data } = await axiosServer.get('/dashboard/admin/debt', {
    params: eventId ? { eventId } : undefined,
  });
  return data; // ← Retorna dados brutos
}

export async function dashboardActiveParticipantsService(
  eventId?: string,
): Promise<unknown> {
  const { data } = await axiosServer.get(
    '/dashboard/admin/active-participants',
    {
      params: eventId ? { eventId } : undefined,
    },
  );
  return data; // ← Retorna dados brutos
}

export async function dashboardActiveEventsService(): Promise<unknown> {
  const { data } = await axiosServer.get('/dashboard/admin/active-events');
  return data; // ← Retorna dados brutos
}
