export type ListInscriptionsPdfResponse = {
  pdfBase64: string;
  filename: string;
};

export type ProcessListInscriptionsPdfDownloadOptions = {
  successMessage?: string;
  defaultFilename?: string;
};

export enum InscriptionStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  PAID = "PAID",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export enum StatusPayment {
  APPROVED = "APPROVED",
  UNDER_REVIEW = "UNDER_REVIEW",
  REFUSED = "REFUSED",
}

export enum PaymentMethod {
  DINHEIRO = "DINHEIRO",
  PIX = "PIX",
  CARTAO = "CARTAO",
}

export type DownloadListInscriptionsPdfInput = {
  eventId: string;
  participants?: boolean;
  payment?: boolean;
  status?: InscriptionStatus | InscriptionStatus[];
  statusPayment?: StatusPayment | StatusPayment[];
  methodPayment?: PaymentMethod | PaymentMethod[];
  isGuest?: boolean;
  startDate?: string;
  endDate?: string;
};
