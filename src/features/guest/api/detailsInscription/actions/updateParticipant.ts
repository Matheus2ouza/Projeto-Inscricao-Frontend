import {
  UpdateGuestParticipantInput,
  UpdateGuestParticipantResult,
} from "@/features/guest/types/detailsInscription/actions/updateParticipantType";
import axiosInstance from "@/shared/lib/apiClient";

export async function updateGuestParticipant(
  input: UpdateGuestParticipantInput,
): Promise<UpdateGuestParticipantResult> {
  try {
    const { data } = await axiosInstance.put<UpdateGuestParticipantResult>(
      `participants/${input.participantId}/update`,
      input,
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
        "Não foi possível atualizar a inscrição",
    );
  }
}
