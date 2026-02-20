import { EventStatusOption } from "@/shared/components/EventStatusFilter";

export const EVENT_STATUS_OPTIONS: EventStatusOption[] = [
  { value: "OPEN", label: "Inscrições Abertas" },
  { value: "CLOSE", label: "Inscrições Fechadas" },
  { value: "FINALIZED", label: "Finalizados" },
];

export type StatusEvent = "OPEN" | "CLOSE" | "FINALIZED";
export const STATUS_EVENT_VALUES: StatusEvent[] = [
  "OPEN",
  "CLOSE",
  "FINALIZED",
];

export type Event = {
  id: string;
  name: string;
  imageUrl: string;
  status: StatusEvent;
  startDate: string;
  endDate: string;
  location?: string;
  countInscriptions: number;
  countGuestInscriptions: number;
  countInscriptionsAnalysis: number;
  countSingleInscriptions: number;
  countSingleDebit: number;
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
