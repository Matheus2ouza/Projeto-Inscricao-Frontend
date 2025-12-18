import axiosInstance from "@/shared/lib/apiClient";

export type UpdateLocationEventRequest = {
  location: string;
  longitude: number;
  latitude: number;
};

type UpdateEventLocationInput = {
  eventId: string;
  location: string;
  longitude: number;
  latitude: number;
};

export async function updateEventLocation({
  eventId,
  location,
  longitude,
  latitude,
}: UpdateEventLocationInput): Promise<void> {
  try {
    await axiosInstance.patch(`/events/${eventId}/update/location`, {
      location,
      longitude,
      latitude,
    });
  } catch (error) {
    console.error("Error updating event location:", error);
    throw new Error("Falha ao atualizar localização do evento");
  }
}

