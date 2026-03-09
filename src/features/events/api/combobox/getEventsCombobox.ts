import {
  EventResponse,
  StatusEvent,
} from "@/features/events/types/combobox/comboboxEventTypes";
import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";

export async function getEventsCombobox(
  status?: StatusEvent,
): Promise<EventResponse> {
  const { data } = await axiosInstance.get<EventResponse>("/events/all/names", {
    params: {
      status,
    },
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return data;
}
