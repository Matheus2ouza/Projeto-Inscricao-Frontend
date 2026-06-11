import axiosInstance from '@/shared/lib/apiClient';
import {
  CreateNewRegisterInput,
  CreateNewRegisterResponse,
} from '../../types/createNewRegister/createNewRegisterTypes';

export async function createNewRegister(
  registerData: CreateNewRegisterInput,
): Promise<CreateNewRegisterResponse> {
  try {
    const { data } = await axiosInstance.post(
      `cash-register/${registerData.cashRegisterId}/register`,
      {
        type: registerData.type,
        method: registerData.method,
        favorite: registerData.favorite,
        value: registerData.value,
        description: registerData.description,
        eventId: registerData.eventId,
        responsible: registerData.responsible,
        images: registerData.images,
        createAt: registerData.createAt,
      },
    );
    return data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível registrar a movimentação. Por favor, tente novamente.',
    );
  }
}
