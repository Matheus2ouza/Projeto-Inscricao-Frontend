import type { Event } from "./eventTypes";

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
};

export type UseEventsForInscriptionResult = UseEventsListResult;

export type UseTicketsEventsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UseTicketsEventsResult = UseEventsListResult;

