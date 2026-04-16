export type ListPaymentsResponse = {
  summary: PaymentsSummary;
  payments: Payment[];
  total: number;
  page: number;
  pageCount: number;
};

export type PaymentsSummary = {
  totalPayments: number;
  totalPaidValue: number;
  totalUnderReviewValue: number;
  totalRefusedValue: number;
};

export type Payment = {
  id: string;
  status: string;
  totalValue: number;
  createdAt: Date;
  imageUrl: string;
  rejectionReason?: string;
  allocation?: PaymentAllocation[];
};

export type PaymentAllocation = {
  value: number;
  inscriptionId: string;
};

export type UseListPaymentParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseListPaymentResult = {
  summary: PaymentsSummary;
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
