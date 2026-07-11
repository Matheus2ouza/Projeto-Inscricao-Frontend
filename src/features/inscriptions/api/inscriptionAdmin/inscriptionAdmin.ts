import {
  createInscriptionAdminData,
  createInscriptionAdminResponse,
} from '@/features/inscriptions/types/inscriptionAdmin/inscriptionAdminTypes';
import { axiosClient } from '@/lib/axios/client';

export async function createInscriptionAdmin(data: createInscriptionAdminData) {
  try {
    const response = await axiosClient.post<createInscriptionAdminResponse>(
      `inscription/admin`,
      data,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível criar a inscrição.',
    );
  }
}
