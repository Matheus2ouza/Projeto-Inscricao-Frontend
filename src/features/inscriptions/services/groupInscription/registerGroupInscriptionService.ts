'use server';

import {
  GroupInscriptionResponse,
  GroupInscriptionSubmit,
} from '@/features/inscriptions/types/groupInscription/registerGroupInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function registerGroupInscriptionService(
  data: GroupInscriptionSubmit,
): Promise<GroupInscriptionResponse> {
  try {
    const { data: response } = await axiosServer.post<GroupInscriptionResponse>(
      '/inscription/group/register',
      data,
    );
    return response;
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
          'Não foi possível realizar a inscrição em grupo no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível realizar a inscrição em grupo no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao realizar inscrição em grupo: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao realizar a inscrição em grupo. Tente novamente mais tarde.',
    );
  }
}
