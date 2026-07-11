'use server';

import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';
import { UpdateInscriptionInput } from '../../types/updateInscription/updateInscriptionTypes';

export async function updateInscriptionService(
  inscriptionId: string,
  update: UpdateInscriptionInput,
) {
  try {
    const { data } = await axiosServer.put(
      `/inscriptions/${inscriptionId}`,
      update,
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
          'Não foi possível atualizar os dados da inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar os dados da inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar inscrição: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar a inscrição. Tente novamente mais tarde.',
    );
  }
}
