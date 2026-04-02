export type ListInscriptionsXlsxResponse = {
  filename: string;
  fileBase64?: string;
  contentType:
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/zip";
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

export type DownloadListInscriptionsXlsxInput = {
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
