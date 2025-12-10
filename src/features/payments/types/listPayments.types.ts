import type { StatusPayment } from "./paymentsDetails.types";

export type PaymentListItem = {
  id: string;
  accountName?: string;
  imageUrl?: string;
  value: number;
  status: StatusPayment;
  approvedBy?: string;
  createdAt: Date;
};

export type PaymentsInscriptions = PaymentListItem[];

export type PaymentGroup = {
  date: string;
  payments: PaymentsInscriptions;
};

export type ListAllPaymentsResponse = {
  groups: PaymentGroup[];
  totalDates: number;
  page: number;
  pageCount: number;
};

export type UsePaymentsListParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UsePaymentsListResult = {
  groups: PaymentGroup[];
  totalDates: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};
