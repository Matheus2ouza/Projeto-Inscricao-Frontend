import { deleteInscriptionParams } from "@/features/inscriptions/types/actions/deleteInscriptionTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function deleteInscription({
  inscriptionId,
}: deleteInscriptionParams) {
  try {
    await axiosInstance.delete(`inscriptions/${inscriptionId}`);
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
