import axiosInstance from "@/shared/lib/apiClient";

export type UpdateLocationEventRequest = {
  location: string;
};

export type UpdateEventLocationInput = {
  eventId: string;
  location: string;
  latitude: number;
  longitude: number;
};

export async function updateEventLocation({
  eventId,
  location,
  latitude,
  longitude,
}: UpdateEventLocationInput): Promise<void> {
  try {
    await axiosInstance.patch(`/events/${eventId}/update/location`, {
      location,
      latitude,
      longitude,
    });
  } catch (error) {
    console.error("Error updating event location:", error);
    throw new Error("Falha ao atualizar localização do evento");
  }
}
