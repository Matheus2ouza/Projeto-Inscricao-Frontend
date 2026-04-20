export type PaymentsDetailsResponse = {
  id: string;
  status: StatusPayment;
  isGuest: boolean;
  responsible: string;
  methodPayment: PaymentMethod;
  totalValue: number;
  createdAt: string;
  imageUrl: string;
  rejectionReason?: string;
  allocations?: PaymentAllocation[];
  installments?: PaymentInstallment[];
};

export type PaymentsDetails = {
  id: string;
  status: StatusPayment;
  isGuest: boolean;
  responsible: string;
  methodPayment: PaymentMethod;
  totalValue: number;
  createdAt: string;
  imageUrl: string;
  rejectionReason?: string;
  allocations?: PaymentAllocation[];
  installments?: PaymentInstallment[];
};

export enum StatusPayment {
  APPROVED = "APROVADO",
  REFUSED = "RECUSADO",
  UNDER_REVIEW = "EM ANÁLISE",
}

export enum PaymentMethod {
  DINHEIRO = "DINHEIRO",
  PIX = "PIX",
  CARTAO = "CARTÃO",
}

export type PaymentInstallment = {
  installmentNumber: number;
  value: number;
  netValue: number;
  paidAt?: Date;
  createdAt: Date;
};

export type PaymentAllocation = {
  value: number;
  inscriptionId: string;
  responsible?: string;
};

export type PaymentDetailParams = {
  paymentId: string;
};

export type PaymentDetailResult = {
  payment: PaymentsDetails | null;
  allocations?: PaymentAllocation[];
  installments?: PaymentInstallment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
