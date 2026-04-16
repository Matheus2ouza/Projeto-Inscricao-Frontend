export enum StatusPayment {
  APPROVED = 'APROVADO',
  REFUSED = 'RECUSADO',
  UNDER_REVIEW = 'EM ANÁLISE',
}

export type ListInscriptionsPending = {
  responsible: string;
  status: StatusPayment;
  totalValue: number;
  totalPaid: number;
};

export type ListInscriptionsPendingResponse = ListInscriptionsPending;
