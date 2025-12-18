export type Event = {
  id: string;
  name: string;
  imageUrl: string;
  status: StatusEvent;
  startDate: string;
  endDate: string;
  countExpenses: number;
  countTotalExpenses: number;
};
export type StatusEvent = "OPEN" | "CLOSE" | "FINALIZED";
export const STATUS_EVENT_VALUES: StatusEvent[] = ["OPEN", "CLOSE", "FINALIZED"];

export type UseEventsParams = {
  initialPage?: number;
  pageSize?: number;
  status?: StatusEvent[];
};

export type getAllEventsResponse = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseEventsResult = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};
