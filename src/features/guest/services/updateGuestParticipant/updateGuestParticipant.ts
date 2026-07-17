'use server';

import {
  UpdateGuestParticipantInput,
  UpdateGuestParticipantResponse,
} from '@/features/guest/types/updateGuestParticipant/updateGuestParticipantTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function updateGuestParticipantService(
  id: string,
  input: UpdateGuestParticipantInput,
): Promise<UpdateGuestParticipantResponse> {
  try {
    const { data } = await axiosServer.put<UpdateGuestParticipantResponse>(
      `participants/${id}`,
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
          'Não foi possível atualizar o participante no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível atualizar o participante no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao atualizar participante: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao atualizar o participante. Tente novamente mais tarde.',
    );
  }
}
