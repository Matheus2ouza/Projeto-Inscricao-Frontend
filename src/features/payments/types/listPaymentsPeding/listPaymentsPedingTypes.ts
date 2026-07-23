export type ListPaymentsPedingResponse = {
  inscriptions: Inscription[];
  allowCard: boolean;
  total: number;
  page: number;
  pageCount: number;
};

export type Inscription = {
  id: string;
  totalValue: number;
  totalPaid: number;
  status: string;
  createAt: Date;
  canPay: boolean;
};

export type UseListPaymentPendingParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
  localityId?: string;
};

export type UseListPaymentPendingResult = {
  inscriptions: Inscription[];
  allowCard: boolean;
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  refresh: () => void;
};
