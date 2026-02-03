import {
  getEventResponse,
  getTypeInscriptionsByEventResponse,
} from "@/features/events/types/manager/eventManagerTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getEvent(eventId: string): Promise<getEventResponse> {
  try {
    const response = await axiosInstance.get<getEventResponse>(
      `/events/${eventId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Falha ao carregar evento");
  }
}

export async function getTypeInscriptionsByEvent(
  eventId: string,
): Promise<getTypeInscriptionsByEventResponse> {
  try {
    const { data } =
      await axiosInstance.get<getTypeInscriptionsByEventResponse>(
        `/type-inscription/event/${eventId}`,
      );
    return data;
  } catch (error) {
    console.error("Error fetching type inscriptions:", error);
    throw new Error("Falha ao carregar tipos de inscrição");
  }
}
