'use server';

import type {
  UpdateTypeInscriptionInput,
  UpdateTypeInscriptionResponse,
} from '@/features/typeInscription/types/updateTypeInscription/updateTypeInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateTypeInscriptionService(
  typeInscriptionId: string,
  input: UpdateTypeInscriptionInput,
): Promise<UpdateTypeInscriptionResponse> {
  try {
    const { data } = await axiosServer.put<UpdateTypeInscriptionResponse>(
      `/type-inscription/${typeInscriptionId}/update`,
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
          'Não foi possível atualizar o tipo de inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar o tipo de inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar tipo de inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar o tipo de inscrição. Tente novamente mais tarde.',
    );
  }
}
