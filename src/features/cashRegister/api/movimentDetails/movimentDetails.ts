import { axiosClient } from '@/lib/axios/client';
import {
  MovimentDetailsInput,
  MovimentDetailsResponse,
} from '../../types/movimentDetails/movimentDetailsTypes';

export async function getMovimentDetails({ movimentId }: MovimentDetailsInput) {
  try {
    const { data } = await axiosClient.get<MovimentDetailsResponse>(
      `cash-register/moviment/${movimentId}`,
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
