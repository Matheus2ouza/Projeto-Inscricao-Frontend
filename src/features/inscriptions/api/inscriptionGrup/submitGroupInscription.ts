import axiosInstance from "@/shared/lib/apiClient";
import {
  GroupInscriptionConfirmationData,
  GroupInscriptionSubmit,
} from "../../types/inscriptionGrup/inscriptionGrupTypes";

export type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
  code?: string;
};

export async function submitGroupInscription(
  data: GroupInscriptionSubmit
): Promise<GroupInscriptionConfirmationData> {
  try {
    const response = await axiosInstance.post<GroupInscriptionConfirmationData>(
      "inscription/group/register",
      data
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    // Lança um erro com a mensagem específica da API
    const errorMessage =
      axiosError.response?.data?.message ||
      "Erro inesperado. Por favor, tente novamente mais tarde.";
    throw new Error(errorMessage);
  }
}
