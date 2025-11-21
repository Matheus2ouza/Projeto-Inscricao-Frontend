import apiClient from "@/shared/lib/apiClient";

export type FindEventDateResponse = {
  events: {
    id: string;
    name: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date;
  }[];
};

export async function getEventsDates(): Promise<FindEventDateResponse> {
  const { data } = await apiClient.get("/events/dates");

  const events =
    Array.isArray(data?.events) && data.events.length > 0
      ? data.events
      : [];

  type EventFromApi = {
    id?: unknown;
    name?: unknown;
    status?: unknown;
    startDate: string | Date;
    endDate: string | Date;
  };

  return {
    events: events.map((evt: EventFromApi) => ({
      id: String(evt.id),
      name: String(evt.name ?? ""),
      status: String(evt.status ?? "OPEN"),
      startDate: evt.startDate,
      endDate: evt.endDate,
    })),
  };
}
