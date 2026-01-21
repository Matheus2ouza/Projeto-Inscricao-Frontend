export type Payment = {
  id: string;
  status: StatusPayment;
  methodPayment: PaymentMethod;
  totalValue: number;
  createdAt: Date;
  imageUrl: string;
  rejectionReason?: string;
  allocation?: PaymentAllocation[];
};

export enum StatusPayment {
  APPROVED = "APROVADO",
  UNDER_REVIEW = "EM_ANALISE",
  REFUSED = "REJEITADO",
}

export enum PaymentMethod {
  DINHEIRO = "DINHEIRO",
  PIX = "PIX",
  CARTAO = "CARTAO",
}

export type AnalysisPaymentsDetailsResponse = {
  id: string;
  status: StatusPayment;
  methodPayment: PaymentMethod;
  totalValue: number;
  createdAt: Date;
  imageUrl: string;
  rejectionReason?: string;
  allocation?: PaymentAllocation[];
};

type PaymentAllocation = {
  value: number;
  inscriptionId: string;
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
