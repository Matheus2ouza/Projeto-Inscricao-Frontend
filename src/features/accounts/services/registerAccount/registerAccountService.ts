import {
  RegisterServiceInput,
  RegisterServiceResponse,
} from '@/features/accounts/types/registerAccount/registerAccountTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function registerAccountService(
  input: RegisterServiceInput,
): Promise<RegisterServiceResponse> {
  try {
    const { data } = await axiosServer.post<RegisterServiceResponse>(
      '/users/create',
      input,
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
          'Não foi possível registrar o novo usuário no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível registrar o novo usuário no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar responsáveis: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao tentar registrar o novo usuário. Tente novamente mais tarde.',
    );
  }
}
