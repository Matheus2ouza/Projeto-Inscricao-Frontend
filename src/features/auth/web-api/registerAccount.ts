import axiosInstance from '@/shared/lib/apiClient';

export type RegisterServiceInput = {
  username: string;
  password: string;
  role: string;
  region?: string | null;
};

export type RegisterServiceOutput = {
  id: string;
};

type RequestData = {
  username: string;
  password: string;
  role: string;
  regionId?: string | null;
};

export async function registerAccount(
  input: RegisterServiceInput,
): Promise<RegisterServiceOutput> {
  const registerData: RequestData = {
    username: input.username,
    password: input.password,
    role: input.role,
    regionId: input.region,
  };

  try {
    const response = await axiosInstance.post('/users/create', registerData);
    const { data } = response;

    return { id: data.id };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error(
      'Erro ao registrar conta:',
      axiosError.response?.data || axiosError.message,
    );
    throw new Error(
      axiosError.response?.data?.message ||
        'Erro inesperado. Por favor, tente novamente mais tarde.',
    );
  }
}
