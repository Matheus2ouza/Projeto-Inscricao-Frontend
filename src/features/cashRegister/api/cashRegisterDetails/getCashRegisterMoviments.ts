import { axiosClient } from '@/lib/axios/client';
import {
  CashEntryType,
  GetCashRegisterMovimentsResponse,
} from '../../types/cashRegisterDetails/cashRegisterDetailsType';

export async function getCashRegisterMoviments(
  cashRegisterId: string,
  page: number,
  pageSize: number,
  type?: CashEntryType[],
  limitTime?: string,
  orderBy?: 'asc' | 'desc',
): Promise<GetCashRegisterMovimentsResponse> {
  try {
    const { data } = await axiosClient.get<GetCashRegisterMovimentsResponse>(
      `cash-register/${cashRegisterId}/moviments`,
      {
        params: {
          type,
          limitTime,
          orderBy,
          page,
          pageSize,
        },
      },
    );
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível carregar os membros.',
    );
  }
}
