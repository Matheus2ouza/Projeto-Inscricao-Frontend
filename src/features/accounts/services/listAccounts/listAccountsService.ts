'use server';

import { ListAccountsResponse } from '@/features/accounts/types/listAccounts/listAccountsTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function listAccountsService(
  page: number,
  pageSize: number,
): Promise<ListAccountsResponse> {
  try {
    const { data } = await axiosServer.get<ListAccountsResponse>(`users`, {
      params: {
        page,
        pageSize,
      },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message } = error.response
          .data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        throw new Error(message);
      }

      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');
        throw new Error(
          'Não foi possível buscar a lista de contas no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar a lista de contas no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar lista de contas: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar a lista de contas. Tente novamente mais tarde.',
    );
  }
}
