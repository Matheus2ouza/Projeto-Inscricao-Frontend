import {
  GenerateInscriptionDetailsPdfInput,
  GenerateInscriptionDetailsPdfResponse,
} from "@/features/inscriptions/types/actions/reports/generateInscriptionDetailsPdfTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function generateInscriptionDetailsPdf({
  inscriptionId,
}: GenerateInscriptionDetailsPdfInput) {
  try {
    const { data } =
      await axiosInstance.get<GenerateInscriptionDetailsPdfResponse>(
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
