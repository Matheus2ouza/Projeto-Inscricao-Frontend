import { axiosClient } from '@/lib/axios/client';
import { CreateInscriptionAvulInput } from '../../inscriptions/types/avulsa/avulsaTypes';

export async function createAvulsaRegistration(
  input: CreateInscriptionAvulInput,
): Promise<{ id: string }> {
  try {
    const { data } = await axiosClient.post<{ id: string }>(
      'inscriptions/avul/create',
      input,
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message || 'Falha ao criar inscrição avulsa',
    );
  }
}
