'use server';

import {
  RegisterGuestInscriptionInput,
  RegisterGuestInscriptionResponse,
} from '@/features/guest/types/guestInscription/registerGuesInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function registerGuestInscriptionService(
  eventId: string,
  input: RegisterGuestInscriptionInput,
): Promise<RegisterGuestInscriptionResponse> {
  try {
    const { data } = await axiosServer.post<RegisterGuestInscriptionResponse>(
      `inscription/guest/${eventId}/register`,
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
          'Não foi possível registrar a inscrição no momento. Tente novamente mais tarde.',
        );
      }

      console.error(error.message);
      throw new Error(
        'Não foi possível registrar a inscrição no momento. Tente novamente mais tarde.',
      );
    }

    console.error(`Erro ao buscar detalhes do evento: ${error}`);
    throw new Error(
      'Ocorreu um erro inesperado ao registrar a inscrição. Tente novamente mais tarde.',
    );
  }
}
