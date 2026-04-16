export type ListAllPaymentsRequest = {
  eventId: string;
  accountId?: string;
  page: number;
  pageSize: number;
};

export type ListAllPaymentsResponse = {
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
  createdAt: string;
  imageUrl: string;
  rejectionReason?: string;
  allocation?: PaymentAllocation[];
};

export type PaymentAllocation = {
  value: number;
  inscriptionId: string;
};

export type UsePaymentsListParams = {
  eventId: string;
  accountId?: string;
  initialPage?: number;
  pageSize?: number;
};

export type UsePaymentsListResult = {
  summary: PaymentsSummary;
  payments: Payment[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};
