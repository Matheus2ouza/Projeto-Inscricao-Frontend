import {
  UpdateParticipantParams,
  UpdateParticipantResponse,
} from "@/features/participants/types/actions/updateParticipantTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function updateParticipant(
  data: UpdateParticipantParams,
): Promise<UpdateParticipantResponse> {
  try {
    const response = await axiosInstance.put(`participants/${data.id}`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Não foi possível atualizar os dados do participante.",
    );
  }
}
