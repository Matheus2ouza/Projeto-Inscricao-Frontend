import axiosInstance from "@/shared/lib/apiClient";
import { getEventResponse } from "../../types/manager/eventManagerTypes";

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
