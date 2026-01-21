import { DetailsInscriptionResponse } from "@/features/inscriptions/types/MyInscriptions/detailsInscriptionTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getDetailsInscription(
  inscriptionId: string,
): Promise<DetailsInscriptionResponse> {
  try {
    const { data } = await axiosInstance.get<DetailsInscriptionResponse>(
      `/inscriptions/${inscriptionId}/details`,
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
        "Não foi possível buscar os detalhes da inscrição.",
    );
  }
}
