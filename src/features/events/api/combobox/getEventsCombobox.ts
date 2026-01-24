import { EventResponse } from "@/features/events/types/combobox/comboboxEventTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function getEventsCombobox(): Promise<EventResponse> {
  const { data } = await axiosInstance.get<EventResponse>("/events/all/names");
  if (Array.isArray(data)) {
    return { event: data };
  }
  return data;
}
