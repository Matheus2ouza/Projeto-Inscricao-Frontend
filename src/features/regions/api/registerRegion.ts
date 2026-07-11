import { axiosClient } from '@/lib/axios';
export type RegisterInput = {
  name: string;
};

export type RegisterOutput = {
  id: string;
};

export async function registerRegion(
  input: RegisterInput,
): Promise<RegisterOutput> {
  const regionData = {
    name: input.name,
  };

  try {
    const response = await axiosClient.post('/regions/create', regionData);
    const { data } = response;

    return { id: data.id };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error(
      'Erro ao registrar região:',
      axiosError.response?.data || axiosError.message,
    );
    throw new Error(
      axiosError.response?.data?.message ||
        'Erro inesperado. Por favor, tente novamente mais tarde.',
    );
  }
}
