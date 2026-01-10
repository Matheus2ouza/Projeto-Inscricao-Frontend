import axiosInstance from "@/shared/lib/apiClient";
import { UpdateParticipantInput } from "../../events/types/checkout/checkoutTypes";

export async function updateParticipant(
  participantId: string,
  input: UpdateParticipantInput
) {
  try {
    const { data } = await axiosInstance.put(
      `/participants/${participantId}/update`,
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
        "Não foi possível atualizar o participante"
    );
  }
}
