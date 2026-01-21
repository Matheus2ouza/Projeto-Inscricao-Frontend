export type AnalysisPaymentsResponse = {
  event: Event;
  payments: Payment[];
  total: number;
  page: number;
  pageCount: number;
};

export type Event = {
  id: string;
  name: string;
  imageUrl: string;
  paymentEnabled: boolean;
  totalPaymentInAnalysis: number;
  totalAmountInAnalysis: number;
};

export type Payment = {
  id: string;
  responsible?: string;
  status: string;
  value: number;
  createdAt: Date;
};

export type UseAnalysisPaymentParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseAnalysisPaymentResult = {
  event?: Event;
  payments: Payment[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  refresh: () => void;
};
