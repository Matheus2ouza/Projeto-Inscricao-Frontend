import { axiosClient } from '@/lib/axios';
import { getDetailsMemberResponse } from '../../types/detailsMember/detailsMemberType';

export async function getDetailsMember(memberId: string) {
  try {
    const { data } = await axiosClient.get<getDetailsMemberResponse>(
      `/members/${memberId}`,
    );
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível carregar os detalhes do membro.',
    );
  }
}
