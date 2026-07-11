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

export type ListEventsToPaymentParams = {
  page: number;
  pageSize: number;
  paymentEnabled?: boolean;
};

export type ListEventsToPaymentResponse = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseListEventsToPaymentParams = {
  initialPage?: number;
  pageSize?: number;
  paymentEnabled?: boolean[];
};

export type UseListEventsToPaymentResult = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};
