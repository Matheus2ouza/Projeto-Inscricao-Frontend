export type PaymentListItem = {
  id: string;
  accountName?: string;
  imageUrl?: string;
  value: number;
  status: string;
  approvedBy?: string;
  createdAt: string;
};

export type PaymentsList = PaymentListItem[];

export type PaymentsListResponse = {
  payments: PaymentsList;
  total: number;
  page: number;
  pageCount: number;
};

export type UsePaymentsListParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UsePaymentsListResult = {
  payments: PaymentsList;
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};
