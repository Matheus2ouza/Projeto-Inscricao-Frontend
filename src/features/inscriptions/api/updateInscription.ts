import axiosInstance from "@/shared/lib/apiClient";
import { UpdateInscriptionInput } from "../types/InscriptionsTypes";

export async function updateInscription(
  inscriptionId: string,
  input: UpdateInscriptionInput
) {
  try {
    const { data } = await axiosInstance.put(
      `inscriptions/${inscriptionId}/update`,
      input
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
        "Não foi possível atualizar os dados da inscrição."
    );
  }
}
