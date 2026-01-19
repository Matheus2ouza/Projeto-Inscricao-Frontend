export type StatusEvent = "OPEN" | "CLOSE" | "FINALIZED";
export const STATUS_EVENT_VALUES: StatusEvent[] = [
  "OPEN",
  "CLOSE",
  "FINALIZED",
];

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quantityParticipants: number;
  amountCollected: number;
  imageUrl?: string;
  logoUrl?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  active?: boolean;
  paymentEnebled: boolean;
  ticketEnabled: boolean;
  regionId: string;
  regionName?: string;
  createdAt: string;
  updatedAt: string;
  countTypeInscriptions?: number;
  description?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  address?: string;
};

export type EventsListQueryParams = {
  page: number;
  pageSize: number;
};

export type EventsListResponse = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
};

type UseEventsListResult = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

export type UseEventsForInscriptionParams = {
  initialPage?: number;
  pageSize?: number;
  status?: StatusEvent[];
};

export type UseEventsForInscriptionResult = UseEventsListResult;

export type UseTicketsEventsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UseTicketsEventsResult = UseEventsListResult;
