export enum StatusPayment {
  APPROVED = 'APPROVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REFUSED = 'REFUSED',
}

export enum PaymentMethod {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO = 'CARTAO',
}

export type Payment = {
  id: string;
  status: StatusPayment;
  isGuest: boolean;
  responsible: string;
  methodPayment: PaymentMethod;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrls: string[];
  rejectionReason?: string;
  allocation?: PaymentAllocation[];
};

export type AnalysisPaymentsDetailsResponse = Payment;

type PaymentAllocation = {
  value: number;
  inscriptionId: string;
  responsible?: string;
};

export type UseAnalysisPaymentDetailsParams = {
  paymentId: string;
};

export type UseAnalysisPaymentDetailsResult = {
  payment?: Payment;
  loading: boolean;
  fetching: boolean;
  fetched: boolean;
  error: Error | null;
  refresh: () => void;
};

export type PaymentActionsResponse = {
  id: string;
  status: StatusPayment;
};
