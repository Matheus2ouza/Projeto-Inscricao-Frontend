export type ListAllPaymentsPendingResponse = {
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

export enum StatusPayment {
  APPROVED = 'approved',
  UNDER_REVIEW = 'under_review',
  REFUSED = 'refused',
}

export type CreatePaymentResponse = {
  id: string;
  status: StatusPayment;
};

export type RegisterPaymentPixResponse = {
  id: string;
  status: StatusPayment;
  confirmationCode: string;
};

export type RegisterPaymentPixAssasResponse = {
  id: string;
  link: string;
  status: string;
};
