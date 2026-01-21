import axiosInstance from "@/shared/lib/apiClient";
import { Event, UpdateEventInput } from "../../../types/eventTypes";

export async function updateEvent(
  eventId: string,
  input: UpdateEventInput,
): Promise<Event> {
  try {
    const response = await axiosInstance.put<Event>(
      `/events/${eventId}`,
      input,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Falha ao atualizar evento");
  }
}
