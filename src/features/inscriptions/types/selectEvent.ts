import { EventStatusOption } from "@/shared/components/EventStatusFilter";

export type Event = {
  id: string;
  name: string;
  imageUrl: string;
  status: StatusEvent;
  startDate: string;
  endDate: string;
  countInscriptions: number;
  countInscriptionsAnalysis: number;
  countSingleInscriptions: number;
  countSingleDebit: number;
};
export type StatusEvent = "OPEN" | "CLOSE" | "FINALIZED";
export const STATUS_EVENT_VALUES: StatusEvent[] = ["OPEN", "CLOSE", "FINALIZED"];

export const EVENT_STATUS_OPTIONS: EventStatusOption[] = [
  { value: "OPEN", label: "Inscrições Abertas" },
  { value: "CLOSE", label: "Inscrições Fechadas" },
  { value: "FINALIZED", label: "Finalizados" },
];

export type UseEventsParams = {
  initialPage?: number;
  pageSize?: number;
  status?: StatusEvent[];
};

export type getAllEventsResponse = {
  events?: Event[];
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
