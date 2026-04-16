export enum StatusPayment {
  APPROVED = "APROVADO",
  UNDER_REVIEW = "EM_ANALISE",
  REFUSED = "RECUSADO",
}

export type RejectedPaymentInput = {
  paymentId: string;
  rejectionReason: string;
};

export type RejectedPaymentResponse = {
  id: string;
  status: StatusPayment;
};
