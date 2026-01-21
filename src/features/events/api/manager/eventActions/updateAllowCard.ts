import axiosInstance from "@/shared/lib/apiClient";
import { Event } from "../../../types/eventTypes";

type AllowCardData = {
  eventId: string;
  allowCard: boolean;
};

export async function updateAllowCard(
  eventId: string,
  allowCard: boolean,
): Promise<Event> {
  const data: AllowCardData = {
    eventId,
    allowCard,
  };

  try {
    console.log("Updating allow card:", eventId, allowCard);
    const response = await axiosInstance.put<Event>(
      `/events/${data.eventId}/allow-card`,
      {},
      {
        params: {
          allowCard: data.allowCard,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating event image:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao atualizar a imagem do evento.",
    );
  }
}
