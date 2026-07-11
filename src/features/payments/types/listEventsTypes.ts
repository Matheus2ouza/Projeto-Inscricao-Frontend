export type Responsible = {
  id: string;
  name: string;
};

export type Event = {
  id: string;
  name: string;
  imageUrl: string;
  status: StatusEvent;
  startDate?: string;
  endDate?: string;
  location?: string;
  paymentEnabled?: boolean;
  totalPayments?: number;
  totalDebt?: number;
  countPaymentsAnalysis?: number;
  amountCollected?: number;
};

export type StatusEvent = 'OPEN' | 'CLOSE' | 'FINALIZED';

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

export type UseEventsForPaymentParams = {
  initialPage?: number;
  pageSize?: number;
  paymentEnabled?: boolean[];
};

export type UseEventsForPaymentResult = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

export type UseTicketsEventsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UseTicketsEventsResult = UseEventsListResult;
