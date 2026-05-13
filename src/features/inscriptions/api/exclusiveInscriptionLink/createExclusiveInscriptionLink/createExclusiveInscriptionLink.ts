import {
  CreateExclusiveInscriptionLinkInput,
  CreateExclusiveInscriptionLinkResponse,
} from '@/features/inscriptions/types/exclusiveInscriptionLink/createExclusiveInscriptionLink/createExclusiveInscriptionLinkTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function createExclusiveInscriptionLink({
  eventId,
  typeInscriptionIds,
  name,
  expiresAt,
}: CreateExclusiveInscriptionLinkInput): Promise<CreateExclusiveInscriptionLinkResponse> {
  try {
    const response = await axiosInstance.post(`exclusive-inscription/create`, {
      eventId,
      typeInscriptionIds,
      name,
      expiresAt,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível criar o link de inscrição.',
    );
  }
}
