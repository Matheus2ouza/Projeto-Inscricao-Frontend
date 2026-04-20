export enum StatusPayment {
  APPROVED = "APROVADO",
  UNDER_REVIEW = "EM_ANALISE",
  REFUSED = "RECUSADO",
}

export type ApprovePaymentInput = {
  paymentId: string;
};

export type ApprovePaymentResponse = {
  id: string;
  status: StatusPayment;
};
