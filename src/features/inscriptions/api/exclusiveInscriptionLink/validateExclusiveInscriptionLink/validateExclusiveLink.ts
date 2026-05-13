import axiosInstance from '@/shared/lib/apiClient';

export async function validateExclusiveLink(token: string): Promise<boolean> {
  try {
    await axiosInstance.get(`exclusive-inscription/${token}/validate`);
    return true;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível validar o link de inscrição.',
    );
  }
}
