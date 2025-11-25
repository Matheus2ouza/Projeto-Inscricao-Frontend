import axiosInstance from "@/shared/lib/apiClient";

export type PublicEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  regionName: string;
  location: string;
  latitude: number;
  longitude: number;
  status: "OPEN" | "CLOSE" | "FINALIZED";
  createdAt: string;
  updatedAt: string;
};

export async function getPublicEvent(eventId: string): Promise<PublicEvent> {
  const { data } = await axiosInstance.get<PublicEvent>(`/events/${eventId}`);
  return data;
}

