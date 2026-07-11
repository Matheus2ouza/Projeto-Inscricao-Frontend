'use server';

import type {
  AccountRole,
  ResponsiblesDialogResponse,
} from '@/features/accounts/types/responsiblesDialog/responsiblesDialogTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import qs from 'qs';

export async function responsiblesDialogService(
  roles?: AccountRole[],
): Promise<ResponsiblesDialogResponse> {
  try {
    const { data } = await axiosServer.get<ResponsiblesDialogResponse>(
      '/users/all/usernames',
      {
        params: {
          roles,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
      },
    );
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
          'Não foi possível buscar os responsáveis no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível buscar os responsáveis no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar responsáveis: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao buscar os responsáveis. Tente novamente mais tarde.',
    );
  }
}
