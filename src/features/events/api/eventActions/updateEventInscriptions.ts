import axiosInstance from "@/shared/lib/apiClient";

export type UpdateEventInscriptionsInput = {
  eventId: string;
  status: "OPEN" | "CLOSE";
};

export type UpdateEventInscriptionsResponse = {
  id: string;
  InscriptionStatus: "OPEN" | "CLOSE";
};

export async function updateEventInscriptions(
  input: UpdateEventInscriptionsInput
): Promise<UpdateEventInscriptionsResponse> {
  try {
    const response = await axiosInstance.patch<UpdateEventInscriptionsResponse>(
      `/events/${input.eventId}/update/inscriptions`,
      { status: input.status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating event inscriptions:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao atualizar status das inscrições do evento"
    );
  }
}
