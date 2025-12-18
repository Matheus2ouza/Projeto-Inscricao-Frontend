import axiosInstance from "@/shared/lib/apiClient";
import {
  IndividualInscriptionSubmit,
  IndivUploadRouteResponse,
} from "../types/individualInscriptionTypes";

export const submitIndividualInscription = async (
  data: IndividualInscriptionSubmit
): Promise<IndivUploadRouteResponse> => {
  try {
    const response = await axiosInstance.post<IndivUploadRouteResponse>(
      "/inscriptions/indiv/upload",
      data
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error(
      "Erro ao enviar inscrição individual:",
      axiosError.response?.data || axiosError.message
    );
    throw new Error(
      axiosError.response?.data?.message ||
      "Erro inesperado. Por favor, tente novamente mais tarde."
    );
  }
};
