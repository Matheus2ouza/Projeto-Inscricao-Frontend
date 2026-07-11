'use server';

import type {
  FindActiveEventsUserResponse,
  FindTotalDebtUserResponse,
  FindTotalInscriptionsUserResponse,
  GetDashboardUserResponse,
} from '@/features/home/types/user/dashboardUserTypes';
import { axiosServer } from '@/lib/axios/server';

export async function dashboardUserService(): Promise<unknown> {
  const { data } =
    await axiosServer.get<GetDashboardUserResponse>('/dashboard/user');
  return data;
}

export async function dashboardUserActiveEventsService(): Promise<unknown> {
  const { data } = await axiosServer.get<FindActiveEventsUserResponse>(
    '/dashboard/user/active-events',
  );
  return data;
}

export async function dashboardUserTotalInscriptionsService(): Promise<unknown> {
  const { data } = await axiosServer.get<FindTotalInscriptionsUserResponse>(
    '/dashboard/user/total-inscriptions',
  );
  return data;
}

export async function dashboardUserTotalDebtService(): Promise<unknown> {
  const { data } = await axiosServer.get<FindTotalDebtUserResponse>(
    '/dashboard/user/total-debt',
  );
  return data;
}
