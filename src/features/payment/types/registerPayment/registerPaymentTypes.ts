export type ListAllPaymentsResponse = {
  inscriptions: Inscriptions[];
  total: number;
  page: number;
  pageCount: number;
};

type Inscriptions = {
  id: string;
  eventId: string;
  accountId: string;
  totalValue: number;
  status: string;
  createAt: Date;
  canPay: boolean;
};

export type UseInscriptionsInAnalisisParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseInscriptionsInAnalisisResult = {
  inscriptions: Inscriptions[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  refresh: () => void;
};

export type CreatePaymentResponse = {
  id: string;
};
