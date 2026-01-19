import axiosInstance from "@/shared/lib/apiClient";
import { UpdateInscriptionInput } from "../../types/MyInscriptions/detailsInscriptionTypes";

export async function updateInscription(
  inscriptionId: string,
  update: UpdateInscriptionInput
) {
  try {
    const { data } = await axiosInstance.put(
      `/inscriptions/${inscriptionId}`,
      update
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

export async function deleteInscription(inscriptionId: string) {
  try {
    const { data } = await axiosInstance.delete(
      `/inscriptions/${inscriptionId}`
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
        "Não foi possível excluir a inscrição."
    );
  }
}
