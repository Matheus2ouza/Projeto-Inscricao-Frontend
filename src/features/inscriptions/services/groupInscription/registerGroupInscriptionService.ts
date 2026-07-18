'use server';

import {
  GroupInscriptionActionResult,
  GroupInscriptionResponse,
  GroupInscriptionSubmit,
} from '@/features/inscriptions/types/groupInscription/registerGroupInscriptionTypes';
import { axiosServer, RespondeErrorData } from '@/lib/axios/server';
import axios from 'axios';

export async function registerGroupInscriptionService(
  data: GroupInscriptionSubmit,
): Promise<GroupInscriptionActionResult> {
  try {
    const { data: response } = await axiosServer.post<GroupInscriptionResponse>(
      '/inscription/group/register',
      data,
    );
    return { success: true, data: response };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { statusCode, timeStamp, message, incompleteMembers } = error
          .response.data as RespondeErrorData;

        console.error(`${timeStamp} - ${statusCode} - ${message}`);

        return { success: false, message, incompleteMembers };
      }

      if (error.request) {
        console.error('Servidor indisponível ou sem resposta.');
        return {
          success: false,
          message:
            'Não foi possível realizar a inscrição em grupo no momento. Tente novamente mais tarde.',
        };
      }

      console.error(error.message);
      return {
        success: false,
        message:
          'Não foi possível realizar a inscrição em grupo no momento. Tente novamente mais tarde.',
      };
    }

    console.error(`Erro ao realizar inscrição em grupo: ${error}`);
    return {
      success: false,
      message:
        'Ocorreu um erro inesperado ao realizar a inscrição em grupo. Tente novamente mais tarde.',
    };
  }
}
