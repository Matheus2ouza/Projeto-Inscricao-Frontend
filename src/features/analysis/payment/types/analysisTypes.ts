export type PaymentAnalysisRequest = {
  page?: number;
  pageSize?: number;
  eventId: string;
};

export type Payments = {
  id: string;
  value: number;
  date: Date;
};

export type Inscriptions = {
  id: string;
  accountName?: string;
  responsible: string;
  totalValue: number;
  countPayments: number;
  payments: Payments[];
};

export type PaymentAnalysisResponse = {
  inscriptions: Inscriptions[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseAnalysisParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseAnalysisResult = {
  analysisData: PaymentAnalysisResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  total: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

export enum PaymentStatus {
  APPROVED = "APPROVED", // Aprovado
  UNDER_REVIEW = "UNDER_REVIEW", //Em Analise
  REFUSED = "REFUSED", // Recusado
}

export type UpdatePaymentResponse = {
  id: string;
  status: string;
};

// Tipos para detalhes de pagamento de uma inscrição
export type PaymentDetail = {
  id: string;
  status: string;
  value: number;
  image?: string | null;
};

export type AnalysisPaymentRequest = {
  inscriptionId: string;
  page: number;
  pageSize: number;
};

export type Inscription = {
  id: string;
  status: string;
  responsible: string;
  phone: string;
  email?: string;
  totalValue: number;
  payments: PaymentDetail[];
};

export type AnalysisPaymentResponse = {
  inscription: Inscription;
  total: number;
  page: number;
  pageCount: number;
};
