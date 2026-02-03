export type Event = {
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
  allowGuest: boolean;
  createdAt: string;
};

export type UsePublicEventParams = {
  eventId: string;
};

export type UsePublicEventResult = {
  event: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type UsePublicEventsResult = {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
