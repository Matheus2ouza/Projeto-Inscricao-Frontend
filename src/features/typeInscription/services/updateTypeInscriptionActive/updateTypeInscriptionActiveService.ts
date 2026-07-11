'use server';

import type {
  UpdateTypeInscriptionActiveInput,
  UpdateTypeInscriptionActiveResponse,
} from '@/features/typeInscription/types/updateTypeInscriptionActive/updateTypeInscriptionActiveTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateTypeInscriptionActiveService({
  typeInscriptionId,
  active,
}: UpdateTypeInscriptionActiveInput): Promise<UpdateTypeInscriptionActiveResponse> {
  try {
    const { data } =
      await axiosServer.patch<UpdateTypeInscriptionActiveResponse>(
        `/type-inscription/${typeInscriptionId}/active`,
        {},
        {
          params: { active },
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
          'Não foi possível alterar o status do tipo de inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível alterar o status do tipo de inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao alterar status do tipo de inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao alterar o status do tipo de inscrição. Tente novamente mais tarde.',
    );
  }
}
