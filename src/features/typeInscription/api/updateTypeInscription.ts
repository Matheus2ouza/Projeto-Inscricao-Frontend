import { axiosClient } from '@/lib/axios/client';
import { TypeInscription } from '../types/typesInscriptionsTypes';

export type UpdateTypeInscriptionInput = {
  description?: string;
  value?: number;
  specialType?: boolean;
  ruleDate?: Date | null;
  participantLimit?: number;
  limitIsStrict?: boolean;
};

export async function updateTypeInscription(
  typeInscriptionId: string,
  input: UpdateTypeInscriptionInput,
): Promise<TypeInscription> {
  try {
    const response = await axiosClient.put<TypeInscription>(
      `/type-inscription/${typeInscriptionId}/update`,
      input,
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
        'Não foi possível atualizar este tipo de inscrição',
    );
  }
}
