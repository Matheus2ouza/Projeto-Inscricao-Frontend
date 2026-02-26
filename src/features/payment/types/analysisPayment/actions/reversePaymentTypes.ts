export enum StatusPayment {
  APPROVED = "APROVADO",
  UNDER_REVIEW = "EM_ANALISE",
  REFUSED = "RECUSADO",
}

export type ReversePaymentInput = {
  paymentId: string;
};

export type ReversePaymentResponse = {
  id: string;
  status: StatusPayment;
};
