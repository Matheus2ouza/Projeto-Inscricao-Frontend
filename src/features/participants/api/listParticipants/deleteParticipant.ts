import axiosInstance from "@/shared/lib/apiClient";

export async function deleteParticipant(participantId: string) {
  try {
    await axiosInstance.delete(`/participants/${participantId}/delete`);
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Não foi possível deletar o participante"
    );
  }
}
