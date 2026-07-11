import { axiosClient } from '@/lib/axios/client';
import qs from 'qs';
import { TypeInscription } from '../types/typesInscriptionsTypes';

export type CreateTypeInscriptionInput = {
  description: string;
  value: number;
  rule: Date | null;
  eventId: string;
  specialType: boolean;
  participantLimit: number;
  limitIsStrict: boolean;
};

export async function createTypeInscription(
  input: CreateTypeInscriptionInput,
): Promise<TypeInscription> {
  try {
    const response = await axiosClient.post<TypeInscription>(
      `/type-inscription/${input.eventId}/create`,
      input,
      {
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
      },
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
        'Não foi possível criar o tipo de inscrição',
    );
  }
}
