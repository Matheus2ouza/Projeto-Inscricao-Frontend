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

export enum StatusPayment {
  APPROVED = 'approved',
  UNDER_REVIEW = 'under_review',
  REFUSED = 'refused',
}

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
