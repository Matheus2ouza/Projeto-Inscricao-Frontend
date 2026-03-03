import { ListDownloadInscriptionDetailsPdfInput } from "@/features/inscriptions/types/list-inscriptions/pdf/inscriptionDetailsPdfTypes";
import { ListInscriptionsPdfResponse } from "@/features/inscriptions/types/list-inscriptions/pdf/listInscriptionsPdfTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function listInscriptionDetailsPdf({
  inscriptionId,
}: ListDownloadInscriptionDetailsPdfInput) {
  try {
    const { data } = await axiosInstance.get<ListInscriptionsPdfResponse>(
      `/inscriptions/${inscriptionId}/details/pdf`,
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
        "Não foi possível buscar as inscrições.",
    );
  }
}
