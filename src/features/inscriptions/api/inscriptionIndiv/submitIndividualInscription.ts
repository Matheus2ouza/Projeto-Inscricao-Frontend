import axiosInstance from "@/shared/lib/apiClient";
import {
  IndividualInscriptionSubmit,
  IndivUploadRouteResponse,
} from "../../types/inscriptionIndiv/individualInscriptionTypes";

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

export const submitIndividualInscription = async (
  data: IndividualInscriptionSubmit,
): Promise<IndivUploadRouteResponse> => {
  try {
    const response = await axiosInstance.post<IndivUploadRouteResponse>(
      "/inscription/indiv/register",
      data,
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
};
